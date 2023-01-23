import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export function useResentVerificationEmail() {

  const client = useApolloClient();

  return useCallback(async () => {

    const response = await client.mutate({
      mutation: gql`
        mutation ResendVerificationEmail {
          resendVerificationEmail {
            id
            status
          }
        }      
      `
    });

    if (response.errors || !response.data) {
      throw response.errors;
    }
  }, [client]);
}
