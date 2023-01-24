import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { User } from './schema/user.type';

interface Response {
  checkUserExists?: User;
}

export function useCheckUserExists() {

  const client = useApolloClient();

  return useCallback(async () => {

    const response = await client.query<Response>({
      query: gql`
        query CheckUserExists {
          checkUserExists {
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

    if (response.error || response.errors || !response.data) {
      throw response.errors;
    }

    return response.data.checkUserExists;
  }, [client]);
}
