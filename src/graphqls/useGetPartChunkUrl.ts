import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

interface Response {
  getPartUploadURL: {
    url: string;
  }
}

export function useGetChunkUploadUrl() {

  const client = useApolloClient();

  return useCallback(async (key: string, partNumber: number, uploadId: string) => {

    const response = await client.mutate<Response>({
      mutation: gql`
        mutation GetPartUploadURL($key: String!, $partNumber: Int!, $uploadId: String!) {
          getPartUploadURL(key: $key, partNumber: $partNumber, uploadId: $uploadId) {
            url
          }
        }
      `,
      variables: {
        key,
        partNumber,
        uploadId
      }
    });

    if (response.errors || !response.data) {
      throw response.errors;
    }

    return response.data.getPartUploadURL.url;
  }, [client]);
}
