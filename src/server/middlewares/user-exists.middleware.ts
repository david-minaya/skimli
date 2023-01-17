import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { Service } from "typedi";
import { GraphQLContext } from "../schema";
import { InternalGraphQLError } from "../types/base.types";

@Service()
export class IsAppUserGuard implements MiddlewareInterface<GraphQLContext> {
  constructor() {}

  async use({ context }: ResolverData<GraphQLContext>, next: NextFn) {
    if (!context?.auth0?.organization_id) {
      throw new InternalGraphQLError("`organization_id` not found in jwt");
    }
    return next();
  }
}
