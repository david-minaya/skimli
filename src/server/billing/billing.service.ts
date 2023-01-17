import { GraphQLError } from "graphql";
import { Service } from "typedi";
import { v4 } from "uuid";
import { AccountsService } from "../accounts/accounts.service";
import { User } from "../accounts/accounts.types";
import { AccountsAPI } from "../api/accounts.api";
import { LagoAPI } from "../api/lago.api";
import { Entitlements } from "../types/accounts.types";
import { APIError, AuthInfo, InternalGraphQLError } from "../types/base.types";
import {
  LagoAssignPlanToCustomerRequest,
  LagoCreateCustomerRequest,
  LagoCustomer,
  LagoSubscription,
} from "../types/lago.types";
import { SubscribeToPlanArgs } from "./billing.args";
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

  async subscribeToPlan(
    authInfo: AuthInfo,
    args: SubscribeToPlanArgs
  ): Promise<User> {
    const user = await this.accountsService.getAppUserById(authInfo.auth0.sub);
    if (user?.subscriptionId) {
      throw new GraphQLError(`Already subscribed to a plan`);
    }

    const organizationId = user?.org.toString() as string;
    const createCustomerParams: LagoCreateCustomerRequest = {
      external_id: organizationId,
      name: user!.email,
      email: user!.email,
      billing_configuration: {
        payment_provider: "stripe",
        sync_with_provider: true,
        sync: true,
      },
    };
    try {
      await this.createCustomer(createCustomerParams);
    } catch (e) {
      console.error(e);
      throw new InternalGraphQLError("Unable to create customer");
    }

    const products = await this.accountsAPI.getProducts(authInfo.token);
    const selectedProduct = products.find(
      (product) => product.code == args.productCode
    );
    if (!selectedProduct) {
      const error = new Error(`Product ${args.productCode} not found`);
      throw new InternalGraphQLError(error);
    }

    const externalSubscriptionId = v4();
    let subscription: LagoSubscription;
    try {
      subscription = await this.assignPlanToCustomer({
        external_customer_id: organizationId,
        external_id: externalSubscriptionId,
        plan_code: selectedProduct.subscriptionPlanCode,
        billing_time: "calendar",
      });
    } catch (e) {
      console.error(e);
      throw new InternalGraphQLError("Error subscribing to plan");
    }

    const entitlements = await this.accountsAPI.getEntitlements(authInfo.token);
    const selectedProductEntitlements: Entitlements = entitlements.filter((e) =>
      selectedProduct.entitlements.includes(e.code)
    );

    const [updatedUser, updateUserError] = await this.accountsAPI.updateUser(
      {
        billingMethod: "SUBSCRIPTION",
        product: selectedProduct,
        entitlements: selectedProductEntitlements,
        subscriptionId: subscription.external_id,
      },
      authInfo.token
    );
    if (updateUserError) {
      throw new APIError(updateUserError);
    }
    return updatedUser as User;
  }
}
