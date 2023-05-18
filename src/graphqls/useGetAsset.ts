import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { Asset } from '~/types/assets.type';
import { useQuery } from '~/hooks/useQuery';

export function useGetAsset() {

  const query = useQuery();

  return useCallback(
    async (id: string) => {
      return query<Asset>({
        name: 'getAsset',
        query: gql`
          query GetAsset($id: String!) {
            getAsset(uuid: $id) {
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
              },
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
        `,
        variables: { id },
        fetchPolicy: 'no-cache',
      });
    },
    [query]
  );
}
