import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';
import { Clip } from '~/types/clip.type';

export function useAddClip() {

  const mutation = useSendMutation();

  return useCallback((assetId: string, caption: string, startTime: string, endTime: string) => {
    return mutation<Clip>({
      name: 'createClip',
      mutation: gql`
        mutation CreateClip($caption: String!, $startTime: String!, $endTime: String!, $assetId: String!) {
          createClip(caption: $caption, startTime: $startTime, endTime: $endTime, assetId: $assetId) {
            uuid
            caption
            startTime
            endTime
            duration
            startFrame
            endFrame
            source
            createdAt
            editedAt
            assetId
          }
        }
      `,
      variables: {
        caption,
        assetId,
        startTime,
        endTime
      }
    });
  }, []);
}
