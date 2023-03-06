import { Field, ObjectType } from "type-graphql";
import { Category as CategoryType } from "../types/categories.types";

@ObjectType()
export class Category implements CategoryType {
  @Field(() => String)
  code: string;

  @Field(() => Boolean)
  archived: boolean;

  @Field(() => String)
  label: string;
}
