import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

interface Response {
  startUpload: {
    key: string;
    uploadId: string;
  }
}

export function useStartUpload() {

  const client = useApolloClient();

  return useCallback(async (filename: string) => {

    const response = await client.mutate<Response>({
      mutation: gql`
        mutation StartUpload($filename: String!) {
          startUpload(filename: $filename) {
            key
            uploadId
          }
        }
      `,
      variables: { filename }
    });

    if (response.errors || !response.data) {
      throw response.errors;
    }

    return response.data.startUpload;
  }, [client]);
}
