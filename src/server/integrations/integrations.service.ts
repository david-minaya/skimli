/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { Service } from "typedi";
import { Auth0Service } from "../auth0/auth0.service";
import { AppMetadata, User as Auth0User, UserMetadata } from "auth0";
import {
  CheckUserIntegrationsUpgradesParams,
  IntegrationCategoryType,
  IntegrationCodeType,
  IntegrationFeatureType,
  IUserIntegration,
  IUserIntegrations,
  CheckUserIntegrationsAvailableParams,
  CheckUserIntegrationsCurrentParams,
} from "../types/integrations.types";
import { GraphQLError } from "graphql";
import { AccountsAPI } from "../api/accounts.api";
import { AuthInfo } from "../types/base.types";

@Service()
export class IntegrationsService {
  constructor(
    private readonly auth0Service: Auth0Service,
    private readonly accountsAPI: AccountsAPI
  ) {}

  async getUserIntegrations(
    authInfo: AuthInfo
  ): Promise<IUserIntegrations | null> {
    let profile: Auth0User<AppMetadata, UserMetadata>;
    try {
      profile = await this.auth0Service.getUserByID(authInfo.auth0.sub);
    } catch (e) {
      throw new GraphQLError("User not found");
    }

    let userFeatures: string[] = profile.app_metadata?.features;
    let featureKeys = userFeatures.map((feature) =>
      feature.toUpperCase().replace(/-/g, "_")
    );
    let upgradeParams: CheckUserIntegrationsUpgradesParams = {
      currentFeatures: featureKeys.map((key) => IntegrationFeatureType[key]),
    };

    let upgrades: IUserIntegration[];
    try {
      const [response, error] =
        await this.accountsAPI.checkUserIntegrationsUpgrades(
          authInfo.token,
          upgradeParams
        );
      upgrades = response ?? [];
    } catch (e) {
      throw new GraphQLError("Get User Integrations Upgrades Failed");
    }

    let availableParams: CheckUserIntegrationsAvailableParams = {
      idpUser: authInfo.auth0.sub,
      currentFeatures: featureKeys.map((key) => IntegrationFeatureType[key]),
    };
    let available: IUserIntegration[];
    try {
      const [response, error] =
        await this.accountsAPI.checkUserIntegrationsAvailable(
          authInfo.token,
          availableParams
        );
      available = response ?? [];
    } catch (e) {
      throw new GraphQLError("Get User Integrations Available Failed");
    }

    let currentParams: CheckUserIntegrationsCurrentParams = {
      idpUser: authInfo.auth0.sub,
    };
    let current: IUserIntegration[];
    try {
      const [response, error] =
        await this.accountsAPI.checkUserIntegrationsCurrent(
          authInfo.token,
          currentParams
        );
      current = response ?? [];
    } catch (e) {
      throw new GraphQLError("Get User Integrations Current Failed");
    }

    let userIntegrations: IUserIntegrations = {
      currentIntegrations: current,
      availableIntegrations: available,
      upgradeRequiredIntegrations: upgrades,
    };

    return userIntegrations;
  }
}
