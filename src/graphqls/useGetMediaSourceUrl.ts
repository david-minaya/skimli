import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';

export function useGetMediaSourceUrl() {

  const query = useQuery();

  return (mediaId: string) => {
    return query<string>({
      name: 'getMediaSourceUrl',
      variables: { mediaId },
      fetchPolicy: 'network-only',
      query: gql`
        query Query($mediaId: String!) {
          getMediaSourceUrl(mediaId: $mediaId)
        }
      `
    });
  };
}
