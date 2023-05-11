import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';
import { AssetMedia } from '~/types/assetMedia.type';

export function useGetAssetMedias() {

  const query = useQuery();

  return (assetId: string) => {
    return query<AssetMedia[]>({
      name: 'getAssetMedias',
      query: gql`
        query GetAssetMedias($assetId: String!) {
          getAssetMedias(assetId: $assetId) {
            uuid
            org
            name
            details {
              sourceUrl
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
      fetchPolicy: 'network-only'
    });
  };
}
