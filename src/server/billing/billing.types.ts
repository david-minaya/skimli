import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Conversions {
  @Field(() => Int)
  conversions: number;

  @Field(() => Int)
  grantedConversions: number;
}
