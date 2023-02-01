import { gql, useQuery } from '@apollo/client';

interface Response {
  getConversions: {
    conversions: number;
    grantedConversions: number;
  };
}

export function useGetConversions() {

  const { data } = useQuery<Response>(gql`{
    getConversions {
      conversions
      grantedConversions
    }
  }`);

  if (data) {
    return {
      counter: data.getConversions.conversions,
      total: data.getConversions.grantedConversions,
    }
  }
}
