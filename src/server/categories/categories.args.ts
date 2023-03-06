import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class GetCategoriesArgs {
  @Field(() => Boolean, { defaultValue: false })
  includeArchived: boolean = false;
}
