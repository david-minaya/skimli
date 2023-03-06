import { Args, Authorized, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { IsAppUserGuard } from "../middlewares/app-user.guard";
import { GetCategoriesArgs } from "./categories.args";
import { CategoriesService } from "./categories.service";
import { Category } from "./categories.types";

@Resolver()
@Service()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => [Category])
  async getCategories(@Args() args: GetCategoriesArgs): Promise<Category[]> {
    return this.categoriesService.findAll(args.includeArchived);
  }
}
