import { ManagementClient } from "auth0";
import { Service } from "typedi";
import config from "../../config";
import { EmailAlreadyVerifiedError } from "./auth0.errors";
import {
  ResendVerificationEmailResponse,
  UserLogResponse,
} from "./auth0.types";

@Service()
export class Auth0Service {
  managementAPI: ManagementClient;

  constructor() {
    this.managementAPI = new ManagementClient({
      domain: config.auth0.auth0Domain,
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
}
