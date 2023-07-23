/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { AppMetadata, User as Auth0User, UserMetadata } from "auth0";
import { GraphQLError } from "graphql";
import { Service } from "typedi";
import AppErrorCodes from "../../common/app-error-codes";
import { UserNotFoundException } from "../accounts/accounts.exceptions";
import { AccountsAPI } from "../api/accounts.api";
import { AyrshareApi } from "../api/ayrshare.api";
import { Auth0Service } from "../auth0/auth0.service";
import {
  AyrshareCreateProfileRequest,
  AyrshareGenerateJwtRequest,
  AyrshareJwt,
  AyrshareNewProfile,
} from "../types/ayrshare.types";
import { AuthInfo, InternalGraphQLError } from "../types/base.types";
import {
  CheckAyrshareProfileParams,
  CheckUserIntegrationParams,
  CheckUserIntegrationsAvailableParams,
  CheckUserIntegrationsCurrentParams,
  CheckUserIntegrationsUpgradesParams,
  CreateAyrshareProfileParams,
  GetNewSocialIntegrationsParams,
  IAyrshareProfile,
  IUserIntegration,
  IUserIntegrations,
  IntegrationCategoryType,
  IntegrationCodeType,
  IntegrationFeatureType,
} from "../types/integrations.types";
import {
  SocialMediaPublishingNotAuthorizedException,
  UserIntegrationAlreadyExistsException,
} from "./integrations.exceptions";

@Service()
export class IntegrationsService {
  constructor(
    private readonly auth0Service: Auth0Service,
    private readonly accountsAPI: AccountsAPI,
    private readonly ayrshareAPI: AyrshareApi
  ) {}

  async getUserIntegrations(
    authInfo: AuthInfo
  ): Promise<IUserIntegrations | null> {
    let profile: Auth0User<AppMetadata, UserMetadata>;
    try {
      profile = await this.auth0Service.getUserByID(authInfo.auth0.sub);
    } catch (e) {
      throw UserNotFoundException;
    }

    let userFeatures: string[] = profile.app_metadata?.features;
    let featureKeys = userFeatures.map((feature) =>
      feature.toUpperCase().replace(/-/g, "_")
    );
    let upgradeParams: CheckUserIntegrationsUpgradesParams = {
      currentFeatures: featureKeys.map((key) => IntegrationFeatureType[key]),
    };

    let upgrades: IUserIntegration[] | null;
    try {
      upgrades = await this.accountsAPI.checkUserIntegrationsUpgrades(
        authInfo.token,
        upgradeParams
      );
    } catch (e) {
      throw new InternalGraphQLError(AppErrorCodes.FAILED_TO_GET_USER_UPGRADES);
    }

    let availableParams: CheckUserIntegrationsAvailableParams = {
      idpUser: authInfo.auth0.sub,
      currentFeatures: featureKeys.map((key) => IntegrationFeatureType[key]),
    };
    let available: IUserIntegration[];
    try {
      available = await this.checkAndSyncAvailableUserIntegrations(
        availableParams,
        authInfo.token
      );
    } catch (e) {
      throw new InternalGraphQLError(
        AppErrorCodes.FAILED_TO_GET_AVAILABLE_INTEGRATIONS
      );
    }

    let currentParams: CheckUserIntegrationsCurrentParams = {
      idpUser: authInfo.auth0.sub,
    };
    let current: IUserIntegration[];
    try {
      current = await this.checkCurrentUserIntegrations(
        currentParams,
        authInfo.token
      );
    } catch (e) {
      throw new GraphQLError("Get User Integrations Current Failed");
    }

    let userIntegrations: IUserIntegrations = {
      currentIntegrations: current,
      availableIntegrations: available,
      upgradeRequiredIntegrations: upgrades ?? [],
    };
    return userIntegrations;
  }

  async addSocialAccount(
    authInfo: AuthInfo,
    code: IntegrationCodeType
  ): Promise<AyrshareJwt> {
    let auth0Profile: Auth0User<AppMetadata, UserMetadata>;
    try {
      auth0Profile = await this.auth0Service.getUserByID(authInfo.auth0.sub);
    } catch (e) {
      throw new InternalGraphQLError(AppErrorCodes.USER_NOT_FOUND);
    }

    // Validate the user is authorized for social media publishing
    let userFeatures: string[] = auth0Profile.app_metadata?.features;
    let featureKeys = userFeatures.map((feature) =>
      feature.toUpperCase().replace(/-/g, "_")
    );
    const hasSocialMediaPublishing = featureKeys.includes(
      IntegrationFeatureType.SOCIAL_MEDIA_PUBLISHING
    );
    if (!hasSocialMediaPublishing) {
      throw SocialMediaPublishingNotAuthorizedException;
    }

    // Validate the user does not already have the integration added
    /*let checkUserIntegrationParams: CheckUserIntegrationParams = {
      idpUser: authInfo.auth0.sub,
      integrationCode: code,
    };
    let userIntegration: IUserIntegration | null;
    try {
      userIntegration = await this.accountsAPI.checkUserIntegration(
        authInfo.token,
        checkUserIntegrationParams
      );
    } catch (e) {
      throw new InternalGraphQLError(AppErrorCodes.FAILED_TO_GET_INTEGRATIONS);
    }
    if (userIntegration) {
      throw UserIntegrationAlreadyExistsException;
    }*/

    // Check if the user has an ayrshare profile in the database
    let checkAyrshareProfileParams: CheckAyrshareProfileParams = {
      idpUser: authInfo.auth0.sub,
    };
    let ayrshareProfile: IAyrshareProfile | null;
    try {
      ayrshareProfile = await this.accountsAPI.checkAyrshareProfile(
        checkAyrshareProfileParams,
        authInfo.token
      );
    } catch (e) {
      throw new InternalGraphQLError(
        AppErrorCodes.FAILED_TO_GET_AYRSHARE_PROFILE
      );
    }

    // If the user does not have an Ayrshare profile, create one in Ayrshare
    // And save it to the database
    if (!ayrshareProfile || ayrshareProfile.profileKey === undefined) {
      let ayrshareCreateProfileParams: AyrshareCreateProfileRequest = {
        title: auth0Profile!.email as string,
      };
      let ayrshareNewProfile: AyrshareNewProfile | null;
      try {
        ayrshareNewProfile = await this.ayrshareAPI.createProfile(
          ayrshareCreateProfileParams
        );
      } catch (e) {
        throw new InternalGraphQLError(
          AppErrorCodes.FAILED_TO_CREATE_AYRSHARE_PROFILE
        );
      }

      let createAyrshareProfileParams: CreateAyrshareProfileParams = {
        idpUser: authInfo.auth0.sub,
        title: ayrshareNewProfile?.title as string,
        profileKey: ayrshareNewProfile?.profileKey as string,
        refId: ayrshareNewProfile?.refId as string,
      };
      try {
        ayrshareProfile = await this.accountsAPI.createAyrshareProfile(
          authInfo.token,
          createAyrshareProfileParams
        );
      } catch (e) {
        throw new GraphQLError("Save Ayrshare Profile Failed");
      }
    }

    // Generate JWT for Ayrshare social account link page
    let ayrshareGenerateJwtRequest: AyrshareGenerateJwtRequest = {
      profileKey: ayrshareProfile?.profileKey as string,
    };
    let ayrshareJwt: AyrshareJwt | any;
    try {
      ayrshareJwt = await this.ayrshareAPI.generateJwt(
        ayrshareGenerateJwtRequest
      );
    } catch (e) {
      throw new InternalGraphQLError(
        AppErrorCodes.FAILED_TO_GENERATE_AYRSHARE_JWT
      );
    }

    return ayrshareJwt;
  }

  async checkAndSyncAvailableUserIntegrations(
    params: CheckUserIntegrationsAvailableParams,
    token: string
  ): Promise<IUserIntegration[]> {
    const available = await this.accountsAPI.getAvailableIntegrations(
      params,
      token
    );
    return await this.syncSocialIntegrations(
      { idpUser: params.idpUser, availableIntegrations: available ?? [] },
      token
    );
  }

  async syncSocialIntegrations(
    params: GetNewSocialIntegrationsParams,
    token: string
  ) {
    const { availableIntegrations, idpUser } = params;
    const ayrShareProfileExists = await this.accountsAPI.checkAyrshareProfile(
      { idpUser: idpUser },
      token
    );
    if (!ayrShareProfileExists || !ayrShareProfileExists.profileKey) {
      return availableIntegrations;
    }
    const ayrShareProfile = await this.ayrshareAPI.getUser({
      profileKey: ayrShareProfileExists.profileKey,
    });

    const currentIntegrations = await this.checkCurrentUserIntegrations(
      { idpUser: idpUser },
      token
    );
    const currentSocialIntegrationsCount = currentIntegrations?.filter(
      (integration) =>
        integration.category === IntegrationCategoryType.SOCIAL_MEDIA
    ).length;
    // Return available integration if Ayrshare and user have no social integrations
    if (
      (!ayrShareProfile.activeSocialAccounts ||
        ayrShareProfile.activeSocialAccounts?.length == 0) &&
      currentSocialIntegrationsCount == 0
    ) {
      return availableIntegrations;
    }

    // If a social account is not a current integration, then add it to the user account
    for (const account of ayrShareProfile.activeSocialAccounts) {
      const integrationCode = `social-media-${account}`;
      const integrated = currentIntegrations.find(
        (c) => c.code == integrationCode
      );
      if (!integrated) {
        await this.accountsAPI.addNewIntegration(
          { idpUser: idpUser, integrationCode: integrationCode },
          token
        );
        // Remove the matching integration from available
        const updatedAvailableIntegrations = availableIntegrations.filter(
          (i) => i.code !== integrationCode
        );
        availableIntegrations.splice(
          0,
          availableIntegrations.length,
          ...updatedAvailableIntegrations
        );
      }
    }

    // If a social account is not a current integration, then add it to the user account
    for (const integration of currentIntegrations) {
      let account = integration.code.substring("social-media-".length);
      const accountMatch = ayrShareProfile?.activeSocialAccounts.find(
        (active) => active === account
      );
      if (!accountMatch) {
        await this.accountsAPI.deleteIntegration(
          {
            idpUser: idpUser,
            integrationCode: integration.code,
          },
          token
        );
        availableIntegrations.push(integration);
      }
    }

    return availableIntegrations;
  }

  async checkCurrentUserIntegrations(
    params: CheckUserIntegrationsCurrentParams,
    token: string
  ) {
    const current = await this.accountsAPI.getCurrentUserIntegrations(
      params,
      token
    );
    const currentSocialIntegrationsCount = current?.filter(
      (integration) =>
        integration.category === IntegrationCategoryType.SOCIAL_MEDIA
    ).length;

    if (current.length === 0 || currentSocialIntegrationsCount === 0) {
      return current;
    }

    const ayrshareProfile = await this.accountsAPI.checkAyrshareProfile(
      { idpUser: params.idpUser },
      token
    );
    if (!ayrshareProfile || !ayrshareProfile?.profileKey) {
      return current;
    }

    const ayrshareUserProfile = await this.ayrshareAPI.getUser({
      profileKey: ayrshareProfile.profileKey,
    });

    if (
      !ayrshareUserProfile ||
      ayrshareUserProfile?.activeSocialAccounts.length === 0
    ) {
      return current;
    }

    ayrshareUserProfile.displayNames.forEach((account) => {
      let integrationCode = "social-media-" + account.platform;
      const integrationMatch = current.find(
        (integration) => integration.code === integrationCode
      );
      if (integrationMatch) {
        integrationMatch.displayName = account.displayName;
        integrationMatch.userImage = account.userImage;
      }
    });
    return current;
  }
}
