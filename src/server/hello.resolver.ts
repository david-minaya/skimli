import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";

// TODO: used initially for testing, remove once there are actual resolvers
@Service()
@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(): string {
    return "hello webapp";
  }
}
