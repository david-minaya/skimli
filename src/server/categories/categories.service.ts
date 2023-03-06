import { Service } from "typedi";
import * as categoriesData from "../../../video-categories.json";
import { Category } from "../types/categories.types";

@Service()
export class CategoriesService {
  async findAll(includeArchived: boolean): Promise<Category[]> {
    return categoriesData.categories.filter((c) => {
      if (includeArchived) {
        return c;
      }
      return c.archived == false;
    });
  }
}
