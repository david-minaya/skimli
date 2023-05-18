import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';
import { AudioAssetMedia } from '~/types/audioAssetMedia.type';
import { SubtitleAssetMedia } from '~/types/subtitleAssetMedia.type';

export function useGetAssetMedias() {
  const query = useQuery();

  return (assetId: string) => {
    return query<(SubtitleAssetMedia | AudioAssetMedia)[]>({
      name: 'getAssetMedias',
      query: gql`
        query GetAssetMedias($assetId: String!) {
          getAssetMedias(assetId: $assetId) {
            uuid
            org
            name
            details {
              ... on SubtitleMediaDetails {
                sourceUrl
              }
              ... on AudioMediaDetails {
                sourceUrl
                muxAssetId
                playbackId
              }
            }
            type
            status
            createdAt
            updatedAt
            assets {
              ids
              count
            }
          }
        }
      `,
      variables: { assetId },
      fetchPolicy: 'network-only',
    });
  };
}
