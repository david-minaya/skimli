import { Service } from "typedi";
import { UsersAPI } from "../api/users.api";
import { APIError, AuthInfo } from "../types/base.types";
import { User } from "./accounts.types";
import { Auth0Service } from "../auth0/auth0.service";
import { GraphQLError } from "graphql";

@Service()
export class AccountsService {
  constructor(
    private readonly usersAPI: UsersAPI,
    private readonly auth0Service: Auth0Service
  ) {}

  async checkUserExists(userId: string): Promise<User | null> {
    let profile;
    try {
      profile = await this.auth0Service.getUserByID(userId);
    } catch (e) {
      throw new GraphQLError("user does not exists");
    }
    const [response, error] = await this.usersAPI.checkUserExists({
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
    const user = await this.checkUserExists(userId);
    if (user) {
      return user;
    }

    const profile = await this.auth0Service.getUserByID(userId);
    const [response, error] = await this.usersAPI.createUser(
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
    await this.auth0Service.setUserMetadata(userId, {
      organization_id: `${response?.org}`,
    });
    return response!;
  }
}
