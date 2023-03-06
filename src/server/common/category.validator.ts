import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import * as categoriesData from "../../../video-categories.json";

function isValidCategory(category: string): boolean {
  return categoriesData.categories.some((c) => c.code == category);
}

@ValidatorConstraint({ name: "category", async: false })
export class IsValidCategory implements ValidatorConstraintInterface {
  validate(category: string) {
    return isValidCategory(category);
  }

  defaultMessage() {
    return "Category not found";
  }
}
