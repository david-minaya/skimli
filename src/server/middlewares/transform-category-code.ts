import { MiddlewareFn } from "type-graphql";
import * as categoriesData from "../../../video-categories.json";

export function TransformCategoryCodeToLabel(): MiddlewareFn {
  return async (_, next) => {
    const categoryCode: string = await next();
    const cateogry = categoriesData.categories.find(
      (c) => c.code == categoryCode
    );
    return cateogry?.label;
  };
}
