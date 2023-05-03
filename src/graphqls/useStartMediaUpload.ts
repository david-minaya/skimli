import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';

export function useStartMediaUpload() {
  
  const mutation = useSendMutation();

  return useCallback((filename: string, assetId: string, type: string, languageCode: string) =>
    mutation<{ key: string; uploadId: string; }>({
      name: 'startMediaUpload',
      mutation: gql`
        mutation StartMediaUpload($filename: String!, $assetId: String!, $type: MediaType!, $languageCode: String!) {
          startMediaUpload(filename: $filename, assetId: $assetId, type: $type, languageCode: $languageCode) {
            key
            uploadId
          }
        }
      `,
      variables: {
        filename,
        assetId,
        type,
        languageCode
      }
    })
  , []);
}
