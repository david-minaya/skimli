import { gql, useQuery } from '@apollo/client';

interface Response {
  getSupportedConversions?: string[];
}

export function useGetSupportedConversions(aspectRatio: string) {

  const { data } = useQuery<Response>(
    gql`
      query Query($aspectRatio: String!) {
        getSupportedConversions(sourceAspectRatio: $aspectRatio)
      }
    `,
    { variables: { aspectRatio } }
  );

  return data?.getSupportedConversions || [];
}
