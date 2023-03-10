import { useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { Asset } from '~/types/assets.type';

interface Response {
  convertToClipsWorkflowStatus: {
    activityStatus: string;
    assetId: string;
    status: Asset['status'];
  }
}

export function useConvertToClipsSubscription(cb: (assetId: string, status: Asset['status']) => void) {

  const client = useApolloClient();

  useEffect(() => {

    const observable = client.subscribe<Response>({
      query: gql`
        subscription {
          convertToClipsWorkflowStatus {
            activityStatus
            status
            assetId
          }
        }
      `
    });

    const subscription = observable.subscribe(observer => {
      const data = observer.data?.convertToClipsWorkflowStatus;
      if (data) {
        cb(data.assetId, data.status)
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);
}
