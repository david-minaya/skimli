import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { Asset } from '~/types/assets.type';
import { useQuery } from '~/hooks/useQuery';

export function useGetAssets() {

  const query = useQuery();

  return useCallback(async (name?: string) => {
    return query<Asset[]>({
      name: 'getAssets',
      query: gql`
        query GetAssets($name: String) {
          getAssets(name: $name) {
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
            inferenceData {
              analysis {
                clips {
                  uuid
                  caption
                  startTime
                  endTime
                  duration
                  startFrame
                  endFrame
                  source
                }
                model
                createdAt
              }
            }
          }
        }
      `,
      variables: { name },
      fetchPolicy: 'network-only'
    });
  }, [query]);
}
