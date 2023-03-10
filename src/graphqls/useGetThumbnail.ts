import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useQuery } from '~/hooks/useQuery';

export function useGetThumbnail(width: number, height: number, playbackId?: string) {

  const query = useQuery();
  const [state, setState] = useState<string>();

  useEffect(() => {
    if (playbackId) {
      query<string>({
        name: 'getThumbnail',
        fetchPolicy: 'cache-first',
        variables: { playbackId, width, height },
        query: gql`
          query Query($playbackId: String!, $height: Int, $width: Int) {
            getThumbnail(playbackId: $playbackId, width: $width, height: $height)
          }
        `
      }).then(value => setState(value));
    }
  }, [query, width, height, playbackId])

  return state;
}
