import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { ArgsType, Field } from "type-graphql";
import { PaymentProviderType } from "../types/accounts.types";

export interface ISubscribeToPlanArgs {
  productCode: string;
  planCode: string;
  isPaid: boolean;
  provider: PaymentProviderType;
  paymentMethodId?: string;
}

@ArgsType()
export class SubscribeToPlanArgs implements ISubscribeToPlanArgs {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  planCode: string;

  @Field(() => Boolean)
  @IsBoolean()
  isPaid: boolean;

  @Field(() => PaymentProviderType)
  provider: PaymentProviderType;

  @Field(() => String, { nullable: true })
  paymentMethodId?: string;

  @Field(() => String, { nullable: true })
  sessionId?: string;
}
