import { AppMetadata, User as Auth0User, UserMetadata } from "auth0";
import { GraphQLError } from "graphql";
import { Service } from "typedi";
import { AccountsAPI } from "../api/accounts.api";
import { LagoAPI } from "../api/lago.api";
import { Auth0Service } from "../auth0/auth0.service";
import {
  IUser,
  PaymentProviderType,
  UserAccountType,
  UserIDPType,
} from "../types/accounts.types";
import { APIError, AuthInfo, InternalGraphQLError } from "../types/base.types";
import { LagoCreateCustomerRequest, LagoCustomer } from "../types/lago.types";

@Service()
export class AccountsService {
  constructor(
    private readonly accountsAPI: AccountsAPI,
    private readonly auth0Service: Auth0Service,
    private readonly lagoAPI: LagoAPI
  ) {}

  async getAppUserById(userId: string): Promise<IUser | null> {
    const [response, error] = await this.accountsAPI.checkUserExists({
      idpUser: userId,
    });
    if (error) {
      throw new APIError(error);
    } else if (!response || response.length <= 0) {
      return null;
    }
    return response[0];
  }

  async checkUserExists(userId: string): Promise<IUser | null> {
    let profile: Auth0User<AppMetadata, UserMetadata>;
    try {
      profile = await this.auth0Service.getUserByID(userId);
    } catch (e) {
      throw new GraphQLError("User not found");
    }
    const [response, error] = await this.accountsAPI.checkUserExists({
      email: profile!.email as string,
      account: UserAccountType.PERSONAL,
    });
    if (error) {
      throw new APIError(error);
    } else if (!response || response.length <= 0) {
      return null;
    }
    return response[0];
  }

  async createCustomer(args: LagoCreateCustomerRequest): Promise<LagoCustomer> {
    const [customer, customerError] = await this.lagoAPI.createOrUpdateCustomer(
      args
    );
    if (customerError) {
      throw new InternalGraphQLError(customerError);
    }
    return customer!;
  }

  async createUser(authInfo: AuthInfo): Promise<IUser> {
    const userId = authInfo.auth0.sub;
    let user: IUser | null;
    if (authInfo.auth0?.organization_id) {
      user = await this.getAppUserById(userId);
    } else {
      user = await this.checkUserExists(userId);
    }

    if (user) {
      return user;
    }

    const profile = await this.auth0Service.getUserByID(userId);
    if (!profile?.email_verified) {
      throw new GraphQLError("Email is not verified");
    }
    const [response, error] = await this.accountsAPI.createUser(
      {
        account: UserAccountType.PERSONAL,
        accountOwner: true,
        email: profile.email as string,
        idp: UserIDPType.AUTH0,
        idpUser: authInfo.auth0.sub,
      },
      authInfo.token
    );
    if (error) {
      throw new APIError(error);
    }

    await this.auth0Service.setUserAppMetadata(userId, {
      organization_id: response?.org!,
      consentGiven: true,
      consentTimestamp: new Date().toUTCString(),
    });

    // create lago customer
    const createCustomerParams: LagoCreateCustomerRequest = {
      external_id: response!.org.toString(),
      name: response?.email ?? "",
      email: response?.email ?? "",
      billing_configuration: {
        payment_provider: "stripe",
        sync_with_provider: true,
        sync: true,
      },
    };

    let lagoCustomer: LagoCustomer;
    try {
      lagoCustomer = await this.createCustomer(createCustomerParams);
    } catch (e) {
      console.error(e);
      throw new InternalGraphQLError("Unable to create customer");
    }

    const updatedUser = await this.accountsAPI.adminUpdateUser({
      uuid: response!.uuid,
      data: {
        paymentMethod: {
          ...response?.paymentMethod,
          isPaymentMethod: false,
          provider: PaymentProviderType.STRIPE,
          paymentMethodId: "",
          providerId: lagoCustomer.billing_configuration?.provider_customer_id,
        },
      },
    });
    return updatedUser;
  }
}
