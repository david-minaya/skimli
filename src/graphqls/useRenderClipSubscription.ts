import { useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';

interface Response {
  renderClipStatus: {
    parentId: string;
    clipId: string;
    status: 'PROCESSING' | 'SUCCESS';
    downloadUrl?: string;
  }
}

export function useRenderClipSubscription(cb: (renderStatus: Response['renderClipStatus']) => void, dependencies?: any[]) {
  
  const client = useApolloClient();

  useEffect(() => {
    const observable = client.subscribe<Response>({
      query: gql`
        subscription RenderClipStatus {
          renderClipStatus {
            parentId
            clipId
            status
            downloadUrl
          }
        }      
      `,
    });

    const subscription = observable.subscribe((observer) => {
      const renderStatus = observer.data?.renderClipStatus;
      if (renderStatus) {
        cb(renderStatus);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, dependencies);
}
