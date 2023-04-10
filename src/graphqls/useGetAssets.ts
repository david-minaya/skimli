import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { Asset } from '~/types/assets.type';
import { useQuery } from '~/hooks/useQuery';

export function useGetAssets() {

  const query = useQuery();

  return useCallback(async (name?: string, skip = 0, take = 1000) => {
    return query<Asset[]>({
      name: 'getAssets',
      query: gql`
        query GetAssets($name: String, $skip: Int, $take: Int) {
          getAssets(name: $name, skip: $skip, take: $take) {
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
          }
        }
      `,
      variables: { name, skip, take },
      fetchPolicy: 'network-only'
    });
  }, [query]);
}
