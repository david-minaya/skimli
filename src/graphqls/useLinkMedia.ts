import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';

export function useLinkMedia() {

  const mutation = useSendMutation();

  return useCallback((assetId: string, mediaId: string) =>
    mutation<void>({
      name: 'linkMediasToAsset',
      mutation: gql`
        mutation LinkMediasToAsset($assetId: String!, $mediaIds: [String!]!) {
          linkMediasToAsset(assetId: $assetId, mediaIds: $mediaIds) {
            uuid
          }
        }
      `,
      variables: {
        assetId,
        mediaIds: [
          mediaId
        ]
      }
    }) 
  ,[]);
}
