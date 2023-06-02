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
                resolution {
                  name
                }
                aspectRatio {
                  decimal
                  dimension
                }
                transcription {
                  status
                  sourceUrl
                  workflowId
                  transcriptionFileStatus
                }
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
              inferenceData {
                human {
                  clips {
                    uuid
                    caption
                    startTime
                    endTime
                    duration
                    startFrame
                    endFrame
                    source
                    createdAt
                  }
                }
              }
              workflows {
                ... on ConvertToClipsWorkflow {
                  workflowId
                  runId
                  status
                  category
                  activityStatus
                  startTime
                  endTime
                  etc
                  model
                }
                ... on PostVideoWorkflow {
                  workflowId
                  runId
                  startTime
                  endTime
                }
              }
            }
          }
        }
      `,
      fetchPolicy: 'no-cache'
    });

    const subscription = observable.subscribe(observer => {
      const asset = observer.data?.convertToClipsWorkflowStatus.asset;
      if (asset) {
        cb(asset);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}
