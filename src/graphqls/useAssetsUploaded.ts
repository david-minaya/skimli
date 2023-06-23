import { useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';

interface Response {
  assetUploads: {
    status: string;
    assetId: string;
  }
}

export function useAseetsUploaded(cb: (status: string, assetId: string) => void) {

  const client = useApolloClient();

  useEffect(() => {

    const observable = client.subscribe<Response>({
      query: gql`
        subscription AssetUploads {
          assetUploads {
            status
            assetId
          }
        }
      `
    });

    const subscription = observable.subscribe(observer => {
      if (observer.data) {
        cb(observer.data?.assetUploads.status, observer.data?.assetUploads.assetId);
      }
    });

    return () => {
      subscription.unsubscribe();
    };

  }, [client, cb]);
}
