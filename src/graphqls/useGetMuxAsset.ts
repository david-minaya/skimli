import { gql, useQuery } from '@apollo/client';
import { MuxAsset } from '~/types/muxAsset.type';

interface Response {
  getMuxAsset: MuxAsset;
}

export function useGetMuxAsset(assetId: string) {

  const { data } = useQuery<Response>(
    gql`
      query GetMuxAsset($assetId: String!) {
        getMuxAsset(assetId: $assetId) {
          asset {
            duration
            playback_ids {
              id
              policy
            }
          }
          tokens {
            video
            thumbnail
            storyboard
          }
        }
      }
    `,
    { 
      variables: { assetId },
      fetchPolicy: 'network-only'
    }
  );

  return data?.getMuxAsset;
}
