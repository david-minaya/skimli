import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { Asset } from '~/types/assets.type';

interface Response {
  getAssets: Asset[];
}

export function useGetAssets() {

  const client = useApolloClient();

  return useCallback(async (name?: string) => {

    const response = await client.query<Response>({
      query: gql`
        query GetAssets($name: String) {
          getAssets(name: $name) {
            uuid
            createdAt
            updatedAt
            org
            name
            status
            sourceMuxAssetId
            mux {
              asset {
                created_at
                duration
                playback_ids {
                  id
                  policy
                }
              }
              tokens {
                video
                thumbnail
                storyboard
              }
            }
          }
        }
      `,
      variables: { name },
      fetchPolicy: 'network-only'
    });

    if (response.error || response.errors || !response.data) {
      throw response.errors;
    }

    return response.data.getAssets;
  }, [client]);
}
