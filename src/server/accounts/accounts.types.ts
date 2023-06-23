import GraphQLJSON from "graphql-type-json";
import { Field, Int, ObjectType } from "type-graphql";
import type {
  BillingMethodType,
  UserAccountType,
  User as UserType,
} from "../types/accounts.types";

@ObjectType()
export class User implements UserType {
  @Field(() => String)
  uuid: string;

  @Field(() => String)
  email: string;

  @Field(() => Int)
  org: number;

  @Field(() => String)
  account: UserAccountType;

  @Field(() => Boolean)
  accountOwner: boolean;

  @Field(() => String)
  idp: "AUTH0";

  @Field(() => String)
  idpUser: string;

  @Field(() => GraphQLJSON, { nullable: true })
  product: object;

  @Field(() => GraphQLJSON, { nullable: true })
  entitlements: any[];

  @Field(() => String, { nullable: true })
  billingMethod: BillingMethodType;

  @Field(() => String, { nullable: true })
  subscriptionId: string;

  @Field(() => GraphQLJSON, { nullable: true })
  settings: object;

  @Field(() => Int)
  conversions: number;

  @Field(() => Int)
  grantedConversions: number;
}
