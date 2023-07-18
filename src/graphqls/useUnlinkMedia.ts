import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';

export function useUnlinkMedia() {

  const mutation = useSendMutation();

  return useCallback((mediaId: string, assetId: string) =>
    mutation<void>({
      name: 'unlinkMedia',
      mutation: gql`
        mutation UnlinkMedia($mediaId: String!, $assetIds: [String!]!) {
          unlinkMedia(mediaId: $mediaId, assetIds: $assetIds)
        }
      `,
      variables: {
        mediaId,
        assetIds: [
          assetId
        ]
      }
    }) 
  ,[]);
}
