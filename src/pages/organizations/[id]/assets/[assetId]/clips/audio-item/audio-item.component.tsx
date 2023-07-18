import Audio from '@mux/mux-audio-react';
import { Box, IconButton } from '@mui/material';
import { PlayIcon } from '~/icons/playIcon';
import { AudioAssetMedia } from '~/types/audioAssetMedia.type';
import { formatSeconds } from '~/utils/formatSeconds';
import { useRef, useState } from 'react';
import { PauseIcon } from '~/icons/pauseIcon';
import { mergeSx } from '~/utils/style';
import { Add, Remove } from '@mui/icons-material';
import { style } from './audio-item.style';

interface Props {
  audioAsset: AudioAssetMedia;
  selected: boolean;
  onAttach: (audioAsset: AudioAssetMedia, duration: number) => void;
  onDetach: (audioAsset: AudioAssetMedia) => void;
}

export function AudioItem(props: Props) {

  const { 
    audioAsset,
    selected, 
    onAttach,
    onDetach
  } = props;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [paused, setAudioPaused] = useState(true);
  const [hover, setHover] = useState(false);
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
      sx={mergeSx(
        style.container, 
        duration === 0 && style.hidden,
        hover && !selected && style.hover, 
        selected && style.selected
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
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
      {hover && !selected &&
        <IconButton
          sx={style.iconButton} 
          size='small'
          onClick={() => onAttach(audioAsset, duration)}>
          <Add/>
        </IconButton>
      }
      {selected &&
        <IconButton
          sx={style.iconButton} 
          size='small'
          onClick={() => onDetach(audioAsset)}>
          <Remove/>
        </IconButton>
      }
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
