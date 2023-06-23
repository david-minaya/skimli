import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';

export function useConvertToClips() {

  const mutation = useSendMutation();

  return useCallback((assetId: string, category: string) => {
    return mutation<{ workflow: string, asset: string }>({
      name: 'convertToClips',
      mutation: gql`
        mutation ConvertToClips($assetId: String!, $category: String!) {
          convertToClips(assetId: $assetId, category: $category) {
            workflow
            asset
          }
        }
      `,
      variables: {
        assetId,
        category
      }
    });
  }, []);
}
