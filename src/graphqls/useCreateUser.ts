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
            billingMethod
            subscriptionId
            settings
            paymentMethod {
              providerId
            }
          }
        }
      `,
    });

    if (response.errors || !response.data) {
      throw response.errors;
    }
  }, [client]);
}
