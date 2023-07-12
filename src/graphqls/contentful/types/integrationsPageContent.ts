/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */


import {IntegrationCardContent} from './integrationCardContent';

export interface IntegrationsPageContent {
    __typename: string;
    name: string;
    comingSoon: IntegrationCardContent[];
    availableNow: IntegrationCardContent[];
}