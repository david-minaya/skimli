import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export function useDeleteAssets() {

  const client = useApolloClient();

  return useCallback(async (assetIds: string[]) => {

    const response = await client.mutate({
      mutation: gql`
        mutation DeleteAssets($assetIds: [String!]!) {
          deleteAssets(assetIds: $assetIds)
        }
      `,
      variables: { assetIds }
    });

    if (response.errors) {
      throw response.errors;
    }
  }, [client]);
}
