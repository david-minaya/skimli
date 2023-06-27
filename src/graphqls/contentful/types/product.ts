/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */


import {Plan} from '~/graphqls/contentful/types/plan';

export interface Product {
    __typname: string;
    name: string;
    code: string;
    description: string;
    buttonCta: string;
    creditCardRequired: boolean;
    plansCollection: ProductPlansCollection;
}

export interface ProductPlansCollection {
    __typename: string;
    items: Plan[];
}