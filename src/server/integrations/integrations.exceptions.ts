/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import AppErrorCodes from "../../common/app-error-codes";
import { BadInputError, FeatureNotAuthorizedError } from "../types/base.types";

export const SocialMediaPublishingNotAuthorizedException =
  new FeatureNotAuthorizedError(
    AppErrorCodes.SOCIAL_MEDIA_PUBLISHING_NOT_AUTHORIZED
  );

export const UserIntegrationAlreadyExistsException = new BadInputError(
  AppErrorCodes.USER_INTEGRATION_ALREADY_EXISTS
);
