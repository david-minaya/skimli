import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';

export function useGetThumbnailQuery() {

  const query = useQuery();

  return useCallback((playbackId: string, width?: number, height?: number, time?: number, fitMode?: string) => {
    return query<string>({
      name: 'getThumbnail',
      fetchPolicy: 'cache-first',
      variables: { playbackId, width, height, time, fitMode },
      query: gql`
        query Query($playbackId: String!, $width: Int, $height: Int, $time: Float, $fitMode: ImageFitMode) {
          getThumbnail(playbackId: $playbackId, width: $width, height: $height, time: $time, fit_mode: $fitMode)
        }
      `
    });
  }, []);
}
