import { useState } from 'react';
import { IconButton } from '@mui/material';
import { LoopIcon } from '~/icons/loopIcon';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { mergeSx } from '~/utils/style';
import { style } from './loop-button.style';

export function LoopButton() {

  const videoPlayer = useVideoPlayer();
  const [active, setActive] = useState(false);

  function handleLoop() {
    videoPlayer.setLoop(loop => {
      if (loop) {
        setActive(false);
        return false;
      } else {
        setActive(true);
        return true;
      }
    })
  }

  return (
    <IconButton
      sx={mergeSx(style.iconButton, active && style.active)}
      size='small'
      onClick={handleLoop}>
      <LoopIcon/>
    </IconButton>
  );
}
