import { Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import type { GraphQLContext } from "../schema";
import { Auth0Service } from "./auth0.service";
import { ResendVerificationEmailResponse } from "./auth0.types";

@Service()
@Resolver()
export class Auth0Resolver {
  constructor(private readonly auth0Service: Auth0Service) {}

  @Authorized()
  @Mutation(() => ResendVerificationEmailResponse)
  async resendVerificationEmail(
    @Ctx() ctx: GraphQLContext
  ): Promise<ResendVerificationEmailResponse> {
    return this.auth0Service.resendVerificationEmail(ctx.auth0.sub);
  }
}
