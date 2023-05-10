import { Service } from "typedi";
import { AccountsAPI } from "../api/accounts.api";
import { APIError, AuthInfo } from "../types/base.types";
import { User } from "./accounts.types";
import { Auth0Service } from "../auth0/auth0.service";
import { GraphQLError } from "graphql";
import { User as Auth0User, AppMetadata, UserMetadata } from "auth0";

@Service()
export class AccountsService {
  constructor(
    private readonly accountsAPI: AccountsAPI,
    private readonly auth0Service: Auth0Service
  ) {}

  async getAppUserById(userId: string): Promise<User | null> {
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

  async checkUserExists(userId: string): Promise<User | null> {
    let profile: Auth0User<AppMetadata, UserMetadata>;
    try {
      profile = await this.auth0Service.getUserByID(userId);
    } catch (e) {
      throw new GraphQLError("User not found");
    }
    const [response, error] = await this.accountsAPI.checkUserExists({
      email: profile!.email as string,
      account: "PERSONAL",
    });
    if (error) {
      throw new APIError(error);
    } else if (!response || response.length <= 0) {
      return null;
    }
    return response[0];
  }

  async createUser(authInfo: AuthInfo): Promise<User> {
    const userId = authInfo.auth0.sub;
    let user: User | null;
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
        account: "PERSONAL",
        accountOwner: true,
        email: profile.email as string,
        idp: "AUTH0",
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
    return response!;
  }
}
