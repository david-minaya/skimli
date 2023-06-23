import { Service } from "typedi";
import { v4 } from "uuid";
import { AccountsService } from "../accounts/accounts.service";
import { User } from "../accounts/accounts.types";
import { AccountsAPI } from "../api/accounts.api";
import { LagoAPI } from "../api/lago.api";
import { Entitlements, Product } from "../types/accounts.types";
import { APIError, AuthInfo, InternalGraphQLError } from "../types/base.types";
import {
  LagoAssignPlanToCustomerRequest,
  LagoCreateCustomerRequest,
  LagoCreateWalletRequest,
  LagoCustomer,
  LagoSubscription,
} from "../types/lago.types";
import { ProductCode, SubscribeToPlanArgs } from "./billing.args";
import { Conversions } from "./billing.types";
import { GraphQLError } from "graphql";
@Service()
export class BillingService {
  constructor(
    private readonly lagoAPI: LagoAPI,
    private readonly accountsService: AccountsService,
    private readonly accountsAPI: AccountsAPI
  ) {}

  async createCustomer(args: LagoCreateCustomerRequest): Promise<LagoCustomer> {
    const [customer, customerError] = await this.lagoAPI.createOrUpdateCustomer(
      args
    );
    if (customerError) {
      throw new InternalGraphQLError(customerError);
    }
    return customer!;
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

  async getPlanDetails(productCode: ProductCode, token: string) {
    const products = await this.accountsAPI.getProducts(token);
    const selectedProduct = products.find(
      (product) => product.code == productCode
    );
    if (!selectedProduct) {
      const error = new Error(`Product ${productCode} not found`);
      throw new InternalGraphQLError(error);
    }

    const entitlements = await this.accountsAPI.getEntitlements(token);
    const selectedProductEntitlements: Entitlements = entitlements.filter((e) =>
      selectedProduct.entitlements.includes(e.code)
    );

    return {
      product: selectedProduct,
      entitlements: selectedProductEntitlements,
    };
  }

  generateWalletForFreePlan(
    org: string,
    product: Product,
    entitlements: Entitlements
  ) {
    const walletName = "con-app-beta-sub-per-fre-conversion";
    const entitlementName = "FREE-VIDEO-CONVERSIONS-GRANTED-10";
    const entitlement = entitlements.find((e) => e.code == entitlementName);
    if (!entitlement) {
      throw new InternalGraphQLError(
        `Entitlement ${entitlementName} not found`
      );
    }
    return {
      name: walletName as string,
      rate_amount: product.billableMetrics[product.subscriptionPlanCode]
        ?.charge_amount as string,
      granted_credits: entitlement.details.value,
      currency: product.subscriptionPlanDetails.subscriptionPlanCurrency,
      external_customer_id: org,
    };
  }

  async subscribeToPlan(
    authInfo: AuthInfo,
    args: SubscribeToPlanArgs
  ): Promise<User> {
    const user = await this.accountsService.getAppUserById(authInfo.auth0.sub);
    if (user?.subscriptionId) {
      throw new GraphQLError(`Already subscribed to a plan`);
    }

    if (args.productCode != ProductCode.FreePlan) {
      throw new GraphQLError("not implemented");
    }

    const organizationId = user?.org.toString() as string;
    const createCustomerParams: LagoCreateCustomerRequest = {
      external_id: organizationId,
      name: user!.email,
      email: user!.email,
      billing_configuration: {
        payment_provider: "stripe",
        sync_with_provider: true,
        sync: false,
      },
    };
    try {
      await this.createCustomer(createCustomerParams);
    } catch (e) {
      console.error(e);
      throw new InternalGraphQLError("Unable to create customer");
    }

    const planDetails = await this.getPlanDetails(
      args.productCode,
      authInfo.token
    );

    const externalSubscriptionId = v4();
    let subscription: LagoSubscription;
    try {
      subscription = await this.assignPlanToCustomer({
        external_customer_id: organizationId,
        external_id: externalSubscriptionId,
        plan_code: planDetails.product.subscriptionPlanCode,
        billing_time: "calendar",
      });
    } catch (e) {
      console.error(e);
      throw new InternalGraphQLError("Error subscribing to plan");
    }

    let createWalletData: LagoCreateWalletRequest;
    let grantedConversions = -1;

    if (args.productCode == ProductCode.FreePlan) {
      createWalletData = this.generateWalletForFreePlan(
        user?.org?.toString() as string,
        planDetails.product,
        planDetails.entitlements
      );

      const [_, createWalletError] = await this.lagoAPI.createWallet(
        createWalletData
      );
      if (createWalletError) {
        console.error(createWalletError);
        throw new InternalGraphQLError(createWalletError);
      }
      grantedConversions = Number(createWalletData.granted_credits);
    }

    const [updatedUser, updateUserError] = await this.accountsAPI.updateUser(
      {
        billingMethod: "SUBSCRIPTION",
        product: planDetails.product,
        entitlements: planDetails.entitlements,
        subscriptionId: subscription.external_id,
        grantedConversions: grantedConversions,
      },
      authInfo.token
    );
    if (updateUserError) {
      throw new APIError(updateUserError);
    }
    return updatedUser as User;
  }

  async getConversions(authInfo: AuthInfo): Promise<Conversions> {
    const user = await this.accountsService.getAppUserById(authInfo.auth0.sub);
    return {
      conversions: user!.conversions,
      grantedConversions: user!.grantedConversions,
    };
  }
}
