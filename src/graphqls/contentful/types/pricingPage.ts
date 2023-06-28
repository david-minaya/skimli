/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {Product} from '~/graphqls/contentful/types/product';

export interface PricingPage {
    name: string;
    headline: string;
    description: string;
    products: Product[];
}
