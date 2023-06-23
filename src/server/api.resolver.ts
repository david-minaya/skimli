import { Authorized, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

@Service()
@Resolver()
export class ApiResolver {
  @Query(() => String)
  hello(): string {
    return "hello web-app";
  }

  @Authorized()
  @Query(() => String)
  authorizedHello(): string {
    return "hello authorized web-app";
  }
}
