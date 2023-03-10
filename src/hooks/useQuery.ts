import { QueryOptions, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

interface Options extends QueryOptions {
  name: string;
}

export function useQuery() {

  const client = useApolloClient();

  return useCallback(async <R = any>(options: Options) => {

    const response = await client.query(options);

    if (response.error || response.errors || !response.data) {
      throw response.errors;
    }

    return response.data[options.name] as R;
  }, []);
}
