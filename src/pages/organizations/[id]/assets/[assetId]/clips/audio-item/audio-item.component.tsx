import Audio from '@mux/mux-audio-react';
import { Box, IconButton } from '@mui/material';
import { PlayIcon } from '~/icons/playIcon';
import { AudioAssetMedia } from '~/types/audioAssetMedia.type';
import { formatSeconds } from '~/utils/formatSeconds';
import { style } from './audio-item.style';
import { useRef, useState } from 'react';
import { PauseIcon } from '~/icons/pauseIcon';
import { mergeSx } from '~/utils/style';

interface Props {
  audioAsset: AudioAssetMedia;
}

export function AudioItem(props: Props) {

  const { audioAsset } = props;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [paused, setAudioPaused] = useState(true);
  const [duration, setAudioDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  function handlePlay() {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }

  return (
    <Box 
      sx={mergeSx(style.container, duration === 0 && style.hidden)}>
      <IconButton onClick={handlePlay}>
        {paused 
          ? <PlayIcon sx={style.icon}/>
          : <PauseIcon sx={style.icon}/>
        }
      </IconButton>
      <Box sx={style.details}>
        <Box sx={style.title}>{audioAsset?.name}</Box>
        <Box sx={style.duration}>
          {!paused && `${formatSeconds(progress)} / `}
          {formatSeconds(duration)}
        </Box>
      </Box>
      {/* @ts-ignore */}
      <Audio
        ref={audioRef}
        loop={true}
        preload='metadata'
        playbackId={`${audioAsset.details?.playbackId}?token=${audioAsset.details?.muxToken}`}
        onPlay={() => setAudioPaused(false)}
        onPause={() => setAudioPaused(true)}
        onDurationChange={(e) => setAudioDuration(e.currentTarget.duration)}
        onTimeUpdate={e => setProgress(e.currentTarget.currentTime)}/>
    </Box>
  );
}
