import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { Part } from '~/types/Part.type';

export function useCompleteUpload() {

  const client = useApolloClient();

  return useCallback(async (key: string, parts: Part[], uploadId: string) => {

    const response = await client.mutate<Response>({
      mutation: gql`
        mutation CompleteUpload($key: String!, $parts: [Part!]!, $uploadId: String!) {
          completeUpload(key: $key, parts: $parts, uploadId: $uploadId)
        }      
      `,
      variables: {
        key,
        parts,
        uploadId
      }
    });

    if (response.errors || !response.data) {
      throw response.errors;
    }
  }, [client]);
}
