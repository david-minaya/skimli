import { useEffect, useMemo } from 'react';
import { useAudioContext } from '~/providers/AudioContextProvider';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { round } from '~/utils/round';
import { useAssets } from '~/store/assets.slice';

export function usePlayAudio(assetId: string) {

  const audioContext = useAudioContext();
  const videoPlayer = useVideoPlayer();
  const assets = useAssets();
  const timelineAudio = assets.getTimelineAudio(assetId);

  const audio = useMemo(() => {
    if (timelineAudio?.asset.src) {
      const audio = new Audio(timelineAudio.asset.src);
      audio.crossOrigin = 'anonymous';
      audioContext.addAudioNode(audio);    
      return audio;
    }
  }, [timelineAudio?.asset.src]);

  useEffect(() => {

    if (!timelineAudio || !audio) return;

    const endTime = timelineAudio.start + timelineAudio.length;

    videoPlayer.onProgress(progress => {

      if (progress >= timelineAudio.start && progress < endTime && audio.paused && !videoPlayer.video?.paused) {
        audioContext.audioNode?.gain.gain.setValueAtTime(timelineAudio.asset.volume, 0);
        audioContext.videoNode?.gain.gain.setValueAtTime(1 - timelineAudio.asset.volume, 0);
        audio.currentTime = round((progress - timelineAudio.start) + timelineAudio.asset.trim, 3);
        audio.play();
      } 
      
      if (progress < timelineAudio.start || progress > endTime && !audio.paused) {
        audioContext.audioNode?.gain.gain.setValueAtTime(0, 0);
        audioContext.videoNode?.gain.gain.setValueAtTime(1, 0);
        audio.pause();
      }
    });

    videoPlayer.onPause(() => {
      audio.pause();
    });

    videoPlayer.onUpdateProgress(progress => {
      audio.currentTime = round((progress - timelineAudio.start) + timelineAudio.asset.trim, 3);
    });

  }, [audio, timelineAudio]);
}

// Calculate the current time of the audio
//
//                                  audio.currentTime = 6
//                                          |
//                                   +-------------+
//                                   |             |
//     |---------------*-------------*-------------*-----------*------------------|
//     0               16            30            44          56                 75
//     |               |             |             |           |                  |
//   start           start         start        progress       end               end
//   (video)         (clip)   (timelineAudio)    (video)      (clip)           (video)
//  
//   audio.currentTime = (video.progress - timelineAudio.start) = (44 - 30) = 6
//
