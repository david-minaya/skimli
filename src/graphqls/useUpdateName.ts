import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export function useUpdateName() {

  const client = useApolloClient();

  return useCallback(async (name: string) => {

    const response = await client.mutate({
      mutation: gql`
        mutation UpdateNickname($name: String!) {
          updateNickname(nickname: $name)
        }
      `,
      variables: { name }
    });

    if (response.errors) {
      throw response.errors;
    }
  }, [client]);
}
