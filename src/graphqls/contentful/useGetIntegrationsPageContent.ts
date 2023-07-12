/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */


import {useEffect, useState} from 'react';
import {gql} from '@apollo/client';
import {contentful} from './contentful';
import {IntegrationsPageContent} from './types/integrationsPageContent';

export function useGetIntegrationsPageContent() {
    const [state, setState] = useState<IntegrationsPageContent>();

    useEffect(()=> {
        (async () => {
            try {
                const response = await contentful.query({
                    query: gql`
                             {
                               integrationsPageCollection(limit: 1) {
                                 items {
                                   __typename
                                   name
                                   comingSoonCollection {
                                     items {
                                       __typename
                                       displayName
                                       integrationCode
                                       description
                                       category
                                       logo {
                                         title
                                         url
                                       }
                                     }
                                   }
                                   availableNowCollection {
                                     items {
                                       __typename
                                       displayName
                                       integrationCode
                                       description
                                       category
                                       logo {
                                         title
                                         url
                                       }
                                     }
                                   }
                                 }
                               }
                             }`

                });

                const integrationsContent = response?.data?.integrationsPageCollection?.items?.[0];

                if (integrationsContent) {
                    setState({
                        __typename: integrationsContent.__typename,
                        name: integrationsContent.name,
                        comingSoon: integrationsContent.comingSoonCollection.items,
                        availableNow: integrationsContent.availableNowCollection.items,
                    });
                }
            } catch (err) {
                console.error(err);
            }
        })();
    },[]);

    return state;
}