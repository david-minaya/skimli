import { Args, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { User } from "../accounts/accounts.types";
import type { GraphQLContext } from "../schema";
import { AuthInfo, InternalGraphQLError } from "../types/base.types";
import { SubscribeToPlanArgs } from "./billing.args";
import { BillingService } from "./billing.service";
import { GraphQLError } from "graphql";
import * as Sentry from "@sentry/nextjs";

@Service()
@Resolver()
export class BillingResolver {
  constructor(private readonly billingService: BillingService) {}

  @Authorized()
  @Mutation(() => User)
  async subscribeToPlan(
    @Ctx() ctx: GraphQLContext,
    @Args() args: SubscribeToPlanArgs
  ): Promise<User> {
    try {
      const authInfo: AuthInfo = { auth0: ctx.auth0, token: ctx.token };
      const user = await this.billingService.subscribeToPlan(authInfo, args);
      return user;
    } catch (e) {
      if (!(e instanceof GraphQLError)) {
        Sentry.captureException(e);
        throw new InternalGraphQLError(e as Error);
      }
      throw e;
    }
  }
}
