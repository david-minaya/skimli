import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

interface Response {
  getThumbnail: string;
}

export function useGetThumbnail() {

  const client = useApolloClient();

  return useCallback(async (playbackId: string, width: number, height: number) => {

    const response = await client.query<Response>({
      query: gql`
        query Query($playbackId: String!, $height: Int, $width: Int) {
          getThumbnail(playbackId: $playbackId, width: $width, height: $height)
        }
      `,
      variables: { playbackId, width, height },
      fetchPolicy: 'cache-first'
    });

    if (response.error || response.errors || !response.data) {
      throw response.errors;
    }

    return response.data.getThumbnail;
  }, [client]);
}
