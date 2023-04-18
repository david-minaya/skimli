import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';
import { Clip } from '~/types/clip.type';

export function useAdjustClip() {

  const mutation = useSendMutation();

  return useCallback((uuid: string, assetId: string, startTime: string, endTime: string) => {
    return mutation<Clip>({
      name: 'adjustClip',
      mutation: gql`
        mutation AdjustClip($uuid: String!, $assetId: String!, $startTime: String!, $endTime: String!) {
          adjustClip(uuid: $uuid, assetId: $assetId, startTime: $startTime, endTime: $endTime) {
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
        uuid,
        assetId,
        startTime,
        endTime
      }
    })
  }, []);
}
