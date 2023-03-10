import { useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { Asset } from '~/types/assets.type';

interface Response {
  convertToClipsWorkflowStatus: {
    asset: Asset;
  }
}

export function useConvertToClipsSubscription(cb: (asset: Asset) => void) {

  const client = useApolloClient();

  useEffect(() => {

    const observable = client.subscribe<Response>({
      query: gql`
        subscription {
          convertToClipsWorkflowStatus {
            asset {
              uuid
              createdAt
              updatedAt
              org
              name
              status
              activityStartTime
              activityStatus
              sourceMuxAssetId
              metadata {
                filesize
              }
              mux {
                asset {
                  created_at
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
              sourceMuxInputInfo {
                file {
                  container_format
                  tracks {
                    ... on SourceMuxInputAudioTrack {
                      type
                      duration
                      encoding
                      channels
                      sample_rate
                    }
                    ... on SourceMuxInputVideoTrack {
                      type
                      width
                      height
                      duration
                      encoding
                      frame_rate
                    }
                  }
                }
              }
            }
          }
        }
      `
    });

    const subscription = observable.subscribe(observer => {
      const asset = observer.data?.convertToClipsWorkflowStatus.asset;
      if (asset) {
        cb(asset)
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);
}
