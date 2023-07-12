/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */


export interface IntegrationCardContent {
    __typename: string;
    displayName: string;
    integrationCode: string;
    description: string;
    category: string;
    logo: IntegrationCardContentLogo;
}

export interface IntegrationCardContentLogo {
    __typename: string;
    title: string;
    url: string;
}