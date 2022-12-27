import { Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import type { GraphQLContext } from "../schema";
import { ResetPasswordArgs, UpdateNicknameArgs } from "./auth0.args";
import { Auth0Service } from "./auth0.service";
import {
  ChangePasswordResponse,
  ResendVerificationEmailResponse,
  ResetPasswordResponse,
  UserLogResponse,
} from "./auth0.types";
import * as Sentry from "@sentry/nextjs";

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

  @Authorized()
  @Mutation(() => String)
  async updateNickname(
    @Args() args: UpdateNicknameArgs,
    @Ctx() ctx: GraphQLContext
  ): Promise<string> {
    return this.auth0Service.updateNickname(ctx.auth0.sub, args.nickname);
  }

  @Authorized()
  @Query(() => [UserLogResponse]!)
  async getUserLogs(@Ctx() ctx: GraphQLContext): Promise<UserLogResponse[]> {
    return this.auth0Service.getUserLogs(ctx.auth0.sub);
  }

  @Authorized()
  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Ctx() ctx: GraphQLContext
  ): Promise<ChangePasswordResponse> {
    try {
      await this.auth0Service.changePassword(ctx.auth0.sub);
      return { ok: true };
    } catch (e) {
      console.error(e);
      Sentry.captureException(e);
      return { ok: false };
    }
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args() args: ResetPasswordArgs
  ): Promise<ResetPasswordResponse> {
    try {
      await this.auth0Service.resetPassword(args.email);
      return { ok: true };
    } catch (e) {
      console.error(e);
      Sentry.captureException(e);
      return { ok: false };
    }
  }
}
