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
    return this.accountsService.checkUserExists(ctx.auth0.sub);
  }

  @Authorized()
  @Mutation(() => User)
  async createUser(@Ctx() ctx: GraphQLContext): Promise<User> {
    const authInfo = { auth0: ctx.auth0, token: ctx.token };
    return this.accountsService.createUser(authInfo);
  }
}
