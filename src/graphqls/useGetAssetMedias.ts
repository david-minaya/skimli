import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';
import { AssetMedia } from '~/types/assetMedia.type';
import { AudioAssetMedia } from '~/types/audioAssetMedia.type';
import { SubtitleAssetMedia } from '~/types/subtitleAssetMedia.type';

interface Args {
  assetId?: string; 
  name?: string;
  type?: AssetMedia['type'];
  status?: AssetMedia['status']; 
  skip?: number;
  take?: number;
}

export function useGetAssetMedias() {

  const query = useQuery();

  return (args: Args) => {
    return query<(SubtitleAssetMedia | AudioAssetMedia)[]>({
      name: 'getAssetMedias',
      query: gql`
        query GetAssetMedias($assetId: String, $name: String, $type: MediaType, $status: MediaStatus, $skip: Int, $take: Int) {
          getAssetMedias(assetId: $assetId, name: $name, type: $type, status: $status, skip: $skip, take: $take) {
            uuid
            org
            name
            type
            status
            createdAt
            updatedAt
            assets {
              ids
              count
            }
            details {
              ... on SubtitleMediaDetails {
                type
                sourceUrl
              }
              ... on AudioMediaDetails {
                type
                sourceUrl
                muxAssetId
                playbackId
                shotstack {
                  id
                  url
                  status
                  render
                }
              }
              ... on ImageMediaDetails {
                type
                sourceUrl
                cdnUrl
              }
            }
          }
        }
      `,
      variables: args,
      fetchPolicy: 'network-only',
    });
  };
}
