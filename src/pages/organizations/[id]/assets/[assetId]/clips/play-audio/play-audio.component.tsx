import { useEffect, useMemo } from 'react';
import { useAudioContext } from '~/providers/AudioContextProvider';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { round } from '~/utils/round';
import { useAssets } from '~/store/assets.slice';

export function usePlayAudio(assetId: string) {

  const audioContext = useAudioContext();
  const videoPlayer = useVideoPlayer();
  const assets = useAssets();
  const clip = assets.getClip(assetId);
  const timelineAudio = assets.getTimelineAudio(assetId);

  const audio = useMemo(() => {
    if (timelineAudio?.asset.src) {
      const audio = new Audio(timelineAudio.asset.src);
      audio.crossOrigin = 'anonymous';
      audioContext.addAudioNode(audio);    
      return audio;
    }
  }, [timelineAudio?.asset.src]);

  console.log(audio);

  useEffect(() => {

    if (!timelineAudio || !audio || !clip) return;

    const startTime = clip.startTime + timelineAudio.start;
    const endTime = startTime + timelineAudio.length;

    videoPlayer.onProgress(progress => {

      if (progress >= startTime && progress < endTime && audio.paused && !videoPlayer.video?.paused) {
        audioContext.audioNode?.gain.gain.setValueAtTime(timelineAudio.asset.volume, 0);
        audioContext.videoNode?.gain.gain.setValueAtTime(1 - timelineAudio.asset.volume, 0);
        audio.currentTime = round((progress - startTime) + timelineAudio.asset.trim, 3);
        audio.play();
        console.log('play audio', audio.currentTime);
      } 
      
      if (progress < startTime || progress > endTime && !audio.paused) {
        audioContext.audioNode?.gain.gain.setValueAtTime(0, 0);
        audioContext.videoNode?.gain.gain.setValueAtTime(1, 0);
        audio.pause();
      }
    });

    videoPlayer.onPause(() => {
      audioContext.videoNode?.gain.gain.setValueAtTime(1, 0);
      audio.pause();
    });

    videoPlayer.onUpdateProgress(progress => {
      audio.currentTime = round((progress - startTime) + timelineAudio.asset.trim, 3);
    });

  }, [audio, timelineAudio, clip]);
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
