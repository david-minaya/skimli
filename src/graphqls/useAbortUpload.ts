import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export function useAbortUpload() {

  const client = useApolloClient();

  return useCallback(async (key: string, uploadId: string) => {

    const response = await client.mutate<Response>({
      mutation: gql`
        mutation AbortUpload($key: String!, $uploadId: String!) {
          abortUpload(key: $key, uploadId: $uploadId)
        }
      `,
      variables: {
        key,
        uploadId
      }
    });

    if (response.errors || !response.data) {
      throw response.errors;
    }
  }, [client]);
}
