import * as Shotstack from '~/types/shotstack';
import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';

export function useUpdateTimeline() {

  const mutation = useSendMutation();

  return useCallback((assetId: string, clipId: string, timeline: Shotstack.Timeline) =>
    mutation<void>({
      name: 'updateClipTimeline',
      mutation: gql`
        mutation UpdateClipTimeline($render: RenderTimelineDetailsArgs!, $clipId: String!, $assetId: String!) {
          updateClipTimeline(assetId: $assetId, clipId: $clipId, render: $render) {
            uuid
          }
        }
      `,
      variables: {
        assetId,
        clipId,
        render: {
          timeline: {
            ...timeline,
            background: undefined
          }
        }
      }
    }) 
  ,[]);
}
