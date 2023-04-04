import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useQuery } from '~/hooks/useQuery';
import { Clip } from '~/types/clip.type';

interface Variables {
  uuid?: string; 
  caption?: string; 
  source?: string;
  uuids?: string[];
  skip?: number; 
  take?: number; 
}

export function useGetClips() {

  const query = useQuery();

  return useCallback((variables: Variables) => {
    return query<Clip[]>({
      name: 'getClips',
      variables,
      query: gql`
        query GetClips(
          $uuid: String, 
          $skip: Int, 
          $take: Int, 
          $caption: String, 
          $source: ClipSourceType, 
          $uuids: [String!]
        ) {
          getClips(
            uuid: $uuid, 
            skip: $skip, 
            take: $take, 
            caption: $caption, 
            source: $source, 
            uuids: $uuids
          ) {
            uuid
            caption
            startTime
            endTime
            duration
            startFrame
            endFrame
            source
            createdAt
            editedAt
            assetId
          }
        }
      `
    })
  }, []);
}