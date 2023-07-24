import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';

interface Size {
  width: number;
  height: number;
}

export function useRenderClip() {
  
  const mutation = useSendMutation();

  return useCallback((clipId: string, assetId: string, size?: Size) =>
    mutation<string | null>({
      name: 'renderClip',
      mutation: gql`
        mutation RenderClip($clipId: String!, $assetId: String!, $output: RenderTimelineOutputArgs!) {
          renderClip(clipId: $clipId, assetId: $assetId, output: $output)
        }
      `,
      variables: {
        clipId,
        assetId,
        output: {
          size
        }
      }
    })
  , []);
}
