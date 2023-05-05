import { useState } from 'react';
import { IconButton } from '@mui/material';
import { TranscriptIcon } from '~/icons/transcriptIcon';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { mergeSx } from '~/utils/style';
import { style } from './caption-button.style';

export function CaptionButton() {

  const videoPlayer = useVideoPlayer();
  const [active, setActive] = useState(false);

  function handleClick() {
    if (videoPlayer.video) { 
      for (const textTrack of videoPlayer.video.textTracks) {
        if (textTrack.mode === 'disabled' || textTrack.mode === 'hidden') {
          textTrack.mode = 'showing';
          setActive(true);
        } else {
          textTrack.mode = 'hidden';
          setActive(false);
        }
      }
    }
  }

  return (
    <IconButton 
      size='small'
      sx={mergeSx(style.iconButton, active && style.active)}
      onClick={handleClick}>
      <TranscriptIcon/>
    </IconButton>
  );
}
