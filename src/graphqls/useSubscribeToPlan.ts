import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export function useSubscribeToPlan() {

  const client = useApolloClient();

  return useCallback(async (productCode: string) => {

    const response = await client.mutate({
      mutation: gql`
        mutation SubscribeToPlan($productCode: ProductCode!) {
          subscribeToPlan(productCode: $productCode) {
            org
            account
            accountOwner
            idp
            idpUser
            email
            product
            entitlements
            billingMethod
            subscriptionId
            settings
          }
        }
      `,
      variables: {
        productCode
      }
    });

    if (response.errors || !response.data) {
      throw response.errors;
    }
  }, [client]);
}
