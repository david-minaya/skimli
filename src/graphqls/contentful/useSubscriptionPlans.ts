import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { contentful } from './contentful';
import { SubscriptionPlanSection } from './types/subscriptionPlanSection';

export function useSubscriptionPlans() {

  const [state, setState] = useState<SubscriptionPlanSection>();

  useEffect(() => {

    (async () => {

      try {

        const response = await contentful.query({
          query: gql`
            {
              subscriptionPlansListCollection {
                items {
                  title
                  pageHeader
                  pageDescription
                  subscriptionPlanItemsCollection {
                    items {
                      buttonName
                      displayPrice
                      features
                      mostPopular
                      planName
                      priceDescription
                      productCode
                      title
                    }
                  }
                }
              }
            }
          `
        });
  
        const subscriptionPlans = response?.data?.subscriptionPlansListCollection?.items?.[0];
  
        if (subscriptionPlans) {
          setState({
            header: subscriptionPlans.pageHeader,
            description: subscriptionPlans.pageDescription,
            subscriptionPlans: subscriptionPlans.subscriptionPlanItemsCollection.items
          });
        }

      } catch (err) {

        console.error(err);
      }
    })();
  }, []);

  return state;
}
