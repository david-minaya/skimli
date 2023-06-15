import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';

export function useDeleteMedia() {

  const mutation = useSendMutation();

  return useCallback((mediaId: string) => {
    return mutation<boolean>({
      name: 'deleteMedia',
      mutation: gql`
        mutation DeleteMedia($mediaId: String!) {
          deleteMedia(mediaId: $mediaId)
        }
      `,
      variables: { mediaId }
    });
  }, []);
}
