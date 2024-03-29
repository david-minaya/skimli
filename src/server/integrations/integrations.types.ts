/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {
  IUserIntegration,
  IntegrationCategoryType,
  IntegrationCodeType,
  IUserIntegrations,
} from "../types/integrations.types";
import { registerEnumType, ObjectType, Field } from "type-graphql";
import { AyrshareJwt } from "../types/ayrshare.types";

registerEnumType(IntegrationCategoryType, {
  name: "IntegrationCategoryType",
});

registerEnumType(IntegrationCodeType, {
  name: "IntegrationCodeType",
});

@ObjectType()
export class UserIntegrations implements IUserIntegrations {
  @Field(() => [UserIntegration], { nullable: true })
  currentIntegrations?: IUserIntegration[];

  @Field(() => [UserIntegration], { nullable: true })
  availableIntegrations?: IUserIntegration[];

  @Field(() => [UserIntegration], { nullable: true })
  upgradeRequiredIntegrations?: IUserIntegration[];
}

@ObjectType()
export class UserIntegration implements IUserIntegration {
  @Field(() => IntegrationCodeType)
  code: IntegrationCodeType;

  @Field(() => IntegrationCategoryType)
  category: IntegrationCategoryType;

  @Field(() => String)
  displayName?: string;

  @Field(() => String)
  userImage?: string;
}

@ObjectType()
export class AyrshareJwtResponse implements AyrshareJwt {
  @Field(() => String)
  status: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  token: string;

  @Field(() => String)
  url: string;

  @Field(() => Boolean)
  emailSent: boolean;

  @Field(() => String)
  expiresIn: string;
}
