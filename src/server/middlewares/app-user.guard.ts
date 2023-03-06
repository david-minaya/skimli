import { GraphQLError } from "graphql";
import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { Service } from "typedi";
import { AccountsService } from "../accounts/accounts.service";
import { GraphQLContext } from "../schema";

@Service()
export class IsAppUserGuard implements MiddlewareInterface<GraphQLContext> {
  constructor(private readonly accountsService: AccountsService) {}

  async use({ context }: ResolverData<GraphQLContext>, next: NextFn) {
    if (context.auth0.organization_id) {
      return next();
    }
    const user = await this.accountsService.getAppUserById(context.auth0.sub);
    if (!user?.org) {
      throw new GraphQLError("organization not set");
    }
    context.auth0.organization_id = user?.org?.toString();
    return next();
  }
}
