import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useQuery } from '~/hooks/useQuery';

export function useGetThumbnail(playbackId?: string, width?: number, height?: number, time?: number) {

  const query = useQuery();
  const [state, setState] = useState<string>();

  useEffect(() => {
    if (playbackId) {
      query<string>({
        name: 'getThumbnail',
        fetchPolicy: 'cache-first',
        variables: { playbackId, width, height, time },
        query: gql`
          query Query($playbackId: String!, $width: Int, $height: Int, $time: Float) {
            getThumbnail(playbackId: $playbackId, width: $width, height: $height, time: $time)
          }
        `
      }).then(value => setState(value));
    }
  }, [query, playbackId, width, height, time])

  return state;
}
