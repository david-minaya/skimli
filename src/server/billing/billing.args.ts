import { ArgsType, Field, registerEnumType } from "type-graphql";

export enum ProductCode {
  FreePlan = "CON-APP-BET-SUB-PER-FRE",
  ProPlan = "CON-APP-BET-SUB-PER-PRO-MON-USD-14D",
  PlusPlan = "CON-APP-BET-SUB-PER-PLU-MON-USD-14D",
}

registerEnumType(ProductCode, {
  name: "ProductCode",
});

@ArgsType()
export class SubscribeToPlanArgs {
  @Field(() => ProductCode, { description: "product code from cms" })
  productCode: ProductCode;
}
