import { AuthenticationClient, ManagementClient, User } from "auth0";
import { Service } from "typedi";
import config from "../../config";
import {
  EmailAlreadyVerifiedError,
  PasswordManagedByGoogleError,
} from "./auth0.errors";
import {
  ResendVerificationEmailResponse,
  UserLogResponse,
} from "./auth0.types";

const USERNAME_PASSWORD_CONNECTION = "Username-Password-Authentication";

@Service()
export class Auth0Service {
  auth0: AuthenticationClient;
  managementAPI: ManagementClient;

  constructor() {
    this.auth0 = new AuthenticationClient({
      domain: config.auth0.auth0Domain,
      clientId: config.auth0.auth0ClientId,
      clientSecret: config.auth0.auth0ClientSecret,
    });

    this.managementAPI = new ManagementClient({
      domain: config.auth0.auth0ManagementAPIDomain,
      clientId: config.auth0.auth0ClientId,
      clientSecret: config.auth0.auth0ClientSecret,
      tokenProvider: {
        enableCache: true,
      },
    });
  }

  async resendVerificationEmail(
    userId: string
  ): Promise<ResendVerificationEmailResponse> {
    const user = await this.managementAPI.getUser({
      id: userId,
    });

    if (user.email_verified) {
      throw EmailAlreadyVerifiedError;
    }

    const verificationJob = await this.managementAPI.sendEmailVerification({
      user_id: userId,
      client_id: config.auth0.auth0ClientId,
    });
    return { id: verificationJob.id, status: verificationJob.status };
  }

  async updateNickname(userId: string, nickname: string): Promise<string> {
    const user = await this.managementAPI.updateUser(
      { id: userId },
      { nickname: nickname }
    );
    return user.nickname!;
  }

  /*
      for reference check below link
      https://auth0.com/docs/manage-users/user-search/user-search-query-syntax
  */
  async getUserLogs(userId: string): Promise<UserLogResponse[]> {
    const logs = await this.managementAPI.getLogs({
      // there is a way to specify only the required fields but it has a bug, so not using it
      // fields: "user_agent,ip,type,date,user_id,isMobile",
      sort: "date:-1",
      // display 20 records
      take: 20,
      q: `user_id:"${userId}" AND (type:"s" OR type:"slo")`,
    });
    const events = logs.map((log) => {
      return {
        isMobile: log?.isMobile,
        userAgent: log?.user_agent,
        ip: log?.ip,
        eventType: log?.type === "s" ? "Logged in" : "Logged out",
        date: new Date(log.date!),
      };
    });
    return events;
  }

  async changePassword(userId: string): Promise<void> {
    const user = await this.managementAPI.getUser({
      id: userId,
    });
    if (!user.user_id?.startsWith("auth0")) {
      throw PasswordManagedByGoogleError;
    }

    await this.auth0.requestChangePasswordEmail({
      email: user.email!,
      connection: USERNAME_PASSWORD_CONNECTION,
      client_id: config.auth0.auth0ClientId,
    });
  }

  async resetPassword(email: string): Promise<void> {
    await this.auth0.requestChangePasswordEmail({
      email: email,
      client_id: config.auth0.auth0ClientId,
      connection: USERNAME_PASSWORD_CONNECTION,
    });
  }

  async getUserByID(userId: string): Promise<User> {
    return this.managementAPI.getUser({
      id: userId,
    });
  }

  async setUserAppMetadata(userId: string, metadata: object): Promise<void> {
    const user = await this.managementAPI.getUser({ id: userId });
    await this.managementAPI.updateAppMetadata(
      { id: userId },
      {
        ...user?.app_metadata,
        ...metadata,
      }
    );
  }
}
