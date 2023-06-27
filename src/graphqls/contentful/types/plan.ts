/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {PlanLimits} from '~/graphqls/contentful/types/planLimits';

export interface Plan {
    __typename: string;
    name: string;
    code: string;
    tier: number;
    price: string;
    credits: number;
    interval: string;
    limits: PlanLimits;
}