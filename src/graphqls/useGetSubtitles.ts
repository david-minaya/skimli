import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';

export function useGetSubtitles() {

  const query = useQuery();

  return (mediaId: string) => {
    return query<string>({
      name: 'getRawSubtitleMedia',
      query: gql`
        query Query($mediaId: String!) {
          getRawSubtitleMedia(mediaId: $mediaId)
        }
      `,
      variables: { mediaId },
      fetchPolicy: 'network-only'
    });
  }
}
