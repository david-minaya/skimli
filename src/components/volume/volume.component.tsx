import { Box, ClickAwayListener, IconButton, Popper, Slider } from '@mui/material';
import { useRef, useState } from 'react';
import { MuteIcon } from '~/icons/muteIcon';
import { VolumeIcon } from '~/icons/volumeIcon';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { style } from './volume.style';

export function Volume() {

  const videoPlayer = useVideoPlayer();
  const volumeRef = useRef<HTMLButtonElement>(null);
  const [showVolume, setShowVolume] = useState(false);

  function handleUpdateVolume(event: Event, value: number | number[]) {
    videoPlayer.updateVolume(value as number);
  }

  function handleMute() {
    videoPlayer.mute();
  }

  return (
    <ClickAwayListener
      mouseEvent='onMouseDown' 
      onClickAway={() => setShowVolume(false)}>
      <Box
        sx={style.volumeOption}>
        <IconButton
          size='small'
          ref={volumeRef}
          onClick={() => setShowVolume(show => !show)}>
          {videoPlayer.muted ? <MuteIcon/> : <VolumeIcon/>}
        </IconButton>
        {/* @ts-ignore */}
        <Popper
          open={showVolume}
          sx={style.volumePopup}
          anchorEl={volumeRef.current}
          modifiers={[{
            name: 'offset',
            options: {
              offset: [0, 16],
            },
          }]}>
          <Slider
            sx={style.slider}
            orientation='vertical'
            value={!videoPlayer.muted ? videoPlayer.volume : 0}
            onChange={handleUpdateVolume}/>
          <IconButton 
            onClick={handleMute}>
            {videoPlayer.muted ? <MuteIcon/> : <VolumeIcon/>}
          </IconButton>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
