import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';

export function useGetAssetSourceUrl() {

  const query = useQuery();

  return (assetId: string) => {
    return query<string>({
      name: 'getAssetSourceUrl',
      query: gql`
        query Query($assetId: String!) {
          getAssetSourceUrl(assetId: $assetId)
        }
      `,
      variables: { assetId },
      fetchPolicy: 'network-only'
    });
  };
}
