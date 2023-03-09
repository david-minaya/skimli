import { MutationOptions, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

interface Options extends MutationOptions {
  name: string;
}

export function useSendMutation() {

  const client = useApolloClient();

  return useCallback(async <R = any>(options: Options) => {

    const response = await client.mutate(options);

    if (response.errors || !response.data) {
      throw response.errors;
    }

    return response.data[options.name] as R;
  }, []);
}
