import { Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import type { GraphQLContext } from "../schema";
import { User } from "./accounts.types";
import { AccountsService } from "./accounts.service";

@Service()
@Resolver()
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Authorized()
  @Query(() => User, { nullable: true })
  async checkUserExists(@Ctx() ctx: GraphQLContext): Promise<User | null> {
    const userId = ctx.auth0.sub;
    if (ctx.auth0?.organization_id) {
      return this.accountsService.getAppUserById(userId);
    }
    return this.accountsService.checkUserExists(userId);
  }

  @Authorized()
  @Mutation(() => User)
  async createUser(@Ctx() ctx: GraphQLContext): Promise<User> {
    const authInfo = { auth0: ctx.auth0, token: ctx.token };
    return this.accountsService.createUser(authInfo);
  }
}
