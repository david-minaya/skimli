import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';

export function useGetSubtitles() {

  const query = useQuery();

  return (mediaId: string) => {
    return query<string>({
      name: 'getSubtitleMedia',
      query: gql`
        query Query($mediaId: String!) {
          getSubtitleMedia(mediaId: $mediaId)
        }
      `,
      variables: { mediaId },
      fetchPolicy: 'network-only'
    });
  };
}
