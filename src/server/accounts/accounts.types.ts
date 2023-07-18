import GraphQLJSON from "graphql-type-json";
import { Field, Float, Int, ObjectType, registerEnumType } from "type-graphql";
import {
  BillingMethodType,
  IUser,
  IUserLimit,
  IUserPaymentMethod,
  PaymentProviderType,
  PlanIntervalType,
  UserAccountType,
  UserIDPType,
  UserLimitType,
  UserLimitUnitType,
} from "../types/accounts.types";

registerEnumType(BillingMethodType, {
  name: "BillingMethodType",
});

registerEnumType(PaymentProviderType, {
  name: "PaymentProviderType",
});

registerEnumType(PlanIntervalType, {
  name: "PlanIntervalType",
});

registerEnumType(UserAccountType, {
  name: "UserAccountType",
});

registerEnumType(UserIDPType, {
  name: "UserIDPType",
});

registerEnumType(UserLimitType, {
  name: "UserLimitType",
});

registerEnumType(UserLimitUnitType, {
  name: "UserLimitUnitType",
});

@ObjectType()
export class UserLimit implements IUserLimit {
  @Field(() => String)
  uuid: string;

  @Field(() => String)
  userId: string;

  @Field(() => UserLimitType)
  type: UserLimitType;

  @Field(() => String)
  billableMetricCode: string;

  @Field(() => Float)
  amount: number;

  @Field(() => UserLimitUnitType)
  units: UserLimitUnitType;
}
@ObjectType()
export class UserPaymentMethod implements IUserPaymentMethod {
  @Field(() => String)
  uuid: string;

  @Field(() => String)
  userId: string;

  @Field(() => PaymentProviderType)
  provider: PaymentProviderType;

  @Field(() => String, { nullable: true })
  providerId?: string;

  @Field(() => Boolean)
  isPaymentMethod: boolean;

  @Field(() => String)
  paymentMethodId: string;
}

@ObjectType()
export class User implements IUser {
  @Field(() => String)
  uuid: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String, { nullable: true })
  updatedAt: string;

  @Field(() => Int)
  org: number;

  @Field(() => UserAccountType)
  account: UserAccountType;

  @Field(() => Boolean)
  accountOwner: boolean;

  @Field(() => UserIDPType)
  idp: UserIDPType;

  @Field(() => String)
  idpUser: string;

  @Field(() => BillingMethodType, { nullable: true })
  billingMethod: BillingMethodType;

  @Field(() => String, { nullable: true })
  subscriptionId: string;

  @Field(() => GraphQLJSON, { nullable: true })
  settings: object;

  @Field(() => String, { nullable: true })
  productCode: string;

  @Field(() => String)
  planCode: string;

  @Field(() => GraphQLJSON, { nullable: true })
  features: object;

  @Field(() => PlanIntervalType, { nullable: true })
  planInterval: PlanIntervalType;

  @Field(() => [UserLimit!]!, { nullable: true })
  limits: IUserLimit[];

  @Field(() => Boolean, { nullable: true })
  isPaid: boolean;

  @Field(() => Boolean, { nullable: true })
  isOverageAllowed: boolean;

  @Field(() => Boolean, { nullable: true })
  hasPaymentMethod: boolean;

  @Field(() => UserPaymentMethod, { nullable: true })
  paymentMethod?: Partial<UserPaymentMethod>;
}
