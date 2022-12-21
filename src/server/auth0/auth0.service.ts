import { ManagementClient } from "auth0";
import { Service } from "typedi";
import config from "../../config";
import { EmailAlreadyVerifiedError } from "./auth0.errors";
import { ResendVerificationEmailResponse } from "./auth0.types";

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
}
