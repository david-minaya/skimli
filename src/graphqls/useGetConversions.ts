import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';

interface Response {
  conversions: number;
  grantedConversions: number;
}

export function useGetConversions() {

  const query = useQuery();

  return () => {
    return query<Response>({
      name: 'getConversions',
      query: gql`
        query GetConversions {
          getConversions {
            conversions
            grantedConversions
          }
        }
      `,
      fetchPolicy: 'no-cache'
    });
  };
}
