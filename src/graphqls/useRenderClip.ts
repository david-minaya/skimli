import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useSendMutation } from '~/hooks/useSendMutation';

type Variables = {
  assetId: string;
  quality: 'LOW' | 'MEDIUM' | 'HIGH';
  muteAudio: boolean;
  clipId: string;
  startTime: number;
  endTime: number;
  width: number;
  height: number;
}

export function useRenderClip() {
  
  const mutation = useSendMutation();

  return useCallback((variables: Variables) =>
    mutation<string | null>({
      name: 'renderClip',
      mutation: gql`
        mutation RenderClip(
          $assetId: String!, 
          $quality: RenderClipQuality!, 
          $muteAudio: Boolean!, 
          $clipId: String!, 
          $startTime: Float, 
          $endTime: Float, 
          $width: Int, 
          $height: Int
        ) {
          renderClip(
            assetId: $assetId, 
            quality: $quality, 
            muteAudio: $muteAudio, 
            clipId: $clipId, 
            startTime: $startTime, 
            endTime: $endTime, 
            width: $width, 
            height: $height
          )
        }
      `,
      variables
    })
  , []);
}
