/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { IsNotEmpty } from "class-validator";
import { ArgsType, Field } from "type-graphql";
import { IntegrationCodeType } from "../types/integrations.types";

@ArgsType()
export class AddSocialAccountArgs {
  @Field(() => IntegrationCodeType)
  @IsNotEmpty()
  code: IntegrationCodeType;
}
