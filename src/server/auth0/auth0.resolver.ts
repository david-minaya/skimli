import { Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import type { GraphQLContext } from "../schema";
import { UpdateNicknameArgs } from "./auth0.args";
import { Auth0Service } from "./auth0.service";
import {
  ResendVerificationEmailResponse,
  UserLogResponse,
} from "./auth0.types";

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
}
