import { Service } from "typedi";
import { v4 } from "uuid";
import AppErrorCodes from "../../common/app-error-codes";
import config from "../../config";
import { UserNotFoundException } from "../accounts/accounts.exceptions";
import { AccountsService } from "../accounts/accounts.service";
import { AccountsAPI } from "../api/accounts.api";
import { LagoAPI } from "../api/lago.api";
import { Auth0Service } from "../auth0/auth0.service";
import { ProductType, UpdateUserRequest } from "../types/accounts.types";
import {
  APIError,
  AuthInfo,
  BadInputError,
  InternalGraphQLError,
} from "../types/base.types";
import {
  ILagoGetInvoicesParams,
  LagoAssignPlanToCustomerRequest,
  LagoInvoice,
  LagoInvoicePaymentStatus,
  LagoSubscription,
} from "../types/lago.types";
import { SubscribeToPlanArgs } from "./billing.args";
import {
  PaymentFailedException,
  PlanNotFoundException,
  PlanSubscriptionFailedException,
  ProductNotFoundException,
  SubscriptionAlreadyActiveException,
  UserNotEligilbeForProductException,
} from "./billing.exceptions";
import { Conversions } from "./billing.types";
import Stripe from "stripe";
import { SetupIntent } from "@stripe/stripe-js";
@Service()
export class BillingService {
  private stripe: Stripe;

  constructor(
    private readonly lagoAPI: LagoAPI,
    private readonly accountsService: AccountsService,
    private readonly accountsAPI: AccountsAPI,
    private readonly auth0Service: Auth0Service
  ) {
    this.stripe = new Stripe(config.stripe.apiKey, {
      apiVersion: "2022-11-15",
    });
  }

  async assignPlanToCustomer(
    params: LagoAssignPlanToCustomerRequest
  ): Promise<LagoSubscription> {
    const [subscription, subscriptionError] =
      await this.lagoAPI.assignPlanToCustomer(params);
    if (subscriptionError) {
      throw new InternalGraphQLError(subscriptionError);
    }
    return subscription!;
  }

  async getLagoInvoice(args: ILagoGetInvoicesParams): Promise<LagoInvoice[]> {
    return this.lagoAPI.getInvoices(args);
  }

  async pollLagoInvoice({
    externalCustomerId,
  }: {
    externalCustomerId: string;
  }): Promise<LagoInvoice> {
    let attempt = 1;

    let invoice: LagoInvoice;
    while (true) {
      console.log(
        `polling invoice with customer id ${externalCustomerId} - #${attempt} time(s)`
      );
      [invoice] = await this.getLagoInvoice({
        external_customer_id: externalCustomerId,
        payment_status: LagoInvoicePaymentStatus.succeeded,
        per_page: 1,
      });
      if (invoice) {
        break;
      } else if (attempt > config.lago.lagoPollMaxAttempts && !invoice) {
        throw new Error(AppErrorCodes.PAYMENT_FAILED);
      }
      const delay = Math.pow(2, attempt) * config.lago.lagoPollInvoiceMinDelay;
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
    return invoice;
  }

  async subscribeToPlan(authInfo: AuthInfo, args: SubscribeToPlanArgs) {
    const user = await this.accountsService.getAppUserById(authInfo.auth0.sub);
    if (!user) throw UserNotFoundException;
    if (user?.subscriptionId) throw SubscriptionAlreadyActiveException;

    if (args.sessionId && args.isPaid) {
      try {
        await this.attachStripePaymentIdToCustomer({
          sessionId: args.sessionId,
          customerId: user?.paymentMethod?.providerId!,
        });
      } catch (e) {
        throw PaymentFailedException;
      }
    }

    const products = await this.accountsAPI.getProducts(authInfo.token);
    const product = products.find((p) => p.code == args.productCode);
    if (
      !product ||
      product.archived ||
      product.type != ProductType.CONSUMER_APP
    ) {
      throw ProductNotFoundException;
    }

    const plan = product.plans.find((plan) => plan.code == args.planCode);
    if (!plan) throw PlanNotFoundException;

    if (product.eligibleAccount != user.account)
      throw UserNotEligilbeForProductException;

    const externalSubscriptionId = v4();
    let subscription: LagoSubscription;
    try {
      subscription = await this.assignPlanToCustomer({
        external_customer_id: user.org.toString(),
        external_id: externalSubscriptionId,
        plan_code: plan.code,
        billing_time: "calendar",
      });
    } catch (e) {
      console.error(e);
      throw PlanSubscriptionFailedException;
    }

    try {
      await this.pollLagoInvoice({ externalCustomerId: user.org.toString() });
    } catch (e) {
      throw new BadInputError((e as Error).message);
    }

    const updateUserParams: UpdateUserRequest = {
      billingMethod: product.billingMethod,
      subscriptionId: subscription.external_id,
      productCode: product.code,
      features: product.features,
      planInterval: plan.interval,
      limits: plan.limits,
      isPaid: args.isPaid,
      isOverageAllowed: product.isOverageAllowed,
      hasPaymentMethod: args.isPaid,
      paymentMethod: {
        ...user.paymentMethod,
        paymentMethodId: args.paymentMethodId ?? "",
        isPaymentMethod: args.isPaid,
      },
    };
    const [updatedUser, updateUserError] = await this.accountsAPI.updateUser(
      updateUserParams,
      authInfo.token
    );
    if (updateUserError) {
      throw new APIError(updateUserError);
    }

    // update auth0 entitlements
    await this.auth0Service.setUserAppMetadata(authInfo.auth0.sub, {
      productCode: updatedUser!.productCode,
      planCode: plan.code,
      isPaid: updatedUser!.isPaid,
      isOverageAllowed: updatedUser!.isOverageAllowed,
      subscriptionId: updatedUser!.subscriptionId,
      features: product.features,
    });
    return updatedUser;
  }

  async getConversions(): Promise<Conversions> {
    return {
      conversions: 0,
      grantedConversions: 100,
    };
  }

  async createStripeSession(authInfo: AuthInfo): Promise<string | null> {
    const user = await this.accountsService.getAppUserById(authInfo.auth0.sub);
    if (!user || !user.paymentMethod?.providerId) {
      return null;
    }

    const baseUrl = `${config.baseUrl}/onboarding`;
    const session = await this.stripe.checkout.sessions.create({
      mode: "setup",
      success_url: `${baseUrl}?success={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?cancelled=true`,
      // TODO: update later ...
      payment_method_types: ["card"],
    });
    return session.url;
  }

  async attachStripePaymentIdToCustomer({
    sessionId,
    customerId,
  }: {
    sessionId: string;
    customerId: string;
  }) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["setup_intent"],
    });
    const paymentMethodId: string = (session.setup_intent as SetupIntent)[
      "payment_method"
    ] as string;
    return this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }
}
