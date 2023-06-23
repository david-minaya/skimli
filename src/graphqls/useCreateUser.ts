import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export function useCreateUser() {

  const client = useApolloClient();

  return useCallback(async () => {

    const response = await client.mutate({
      mutation: gql`
        mutation CreateUser {
          createUser {
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
      `
    });

    if (response.errors || !response.data) {
      throw response.errors;
    }
  }, [client]);
}
