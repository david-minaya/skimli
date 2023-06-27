/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */


export interface PlanLimits {
    __typename: string;
    name: string;
    mediaGeneratedCredits: number;
    minutesVideo: number;
    minutesMetadata: number;
    libraryStorageGigabytes: number;
    distributionBandwidthGigabytes: number;
}