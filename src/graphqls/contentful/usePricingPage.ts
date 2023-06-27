/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {useEffect, useState} from 'react';
import {gql} from '@apollo/client';
import {contentful} from './contentful';
import {PricingPage} from "./types/pricingPage";

export function usePricingPage() {
    const [state, setState] = useState<PricingPage>();

    useEffect(() => {
        (async () => {
            try {

                const response = await contentful.query({
                    query: gql`
                   {
                     webappPricingPageCollection(limit: 1) {
                       items {
                         headline
                         description
                         productsCollection(limit: 10) {
                           items {
                             name
                             code
                             description
                             buttonCta
                             creditCardRequired
                             plansCollection(limit: 10) {
                               items {
                                 name
                                 code
                                 tier
                                 price
                                 credits
                                 interval
                                 limits {
                                   name
                                   mediaGeneratedCredits
                                   minutesVideo
                                   minutesMetadata
                                   libraryStorageGigabytes
                                   distributionBandwidthGigabytes
                                 }
                               }
                             }
                           }
                         }
                       }
                     }
                   }
                   `
                });

                const pricingContent = response?.data?.webappPricingPageCollection?.items?.[0];

                if (pricingContent) {
                    setState({
                        name: pricingContent.name,
                        headline: pricingContent.headline,
                        description: pricingContent.description,
                        products: pricingContent.productsCollection.items,
                    });
                }

            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    return state;
}
