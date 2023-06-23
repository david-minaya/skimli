import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export function useResetPassword() {

  const client = useApolloClient();

  return useCallback(async (email: string) => {

    const response = await client.mutate({
      mutation: gql`
        mutation ResetPassword($email: String!) {
          resetPassword(email: $email) {
            ok
          }
        }
      `,
      variables: { email }
    });

    if (response.errors || !response.data) {
      throw response.errors;
    }
  }, [client]);
}
