import { IconButton } from '@mui/material';
import { PauseIcon } from '~/icons/pauseIcon';
import { PlayIcon } from '~/icons/playIcon';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { style } from './play-button.style';

export function PlayButton() {

  const videoPlayer = useVideoPlayer();

  function handlePlay() {
    if (videoPlayer.video?.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();   
    }
  }

  return (
    <IconButton
      sx={style.playButton} 
      size='small'
      onClick={handlePlay}>
      {videoPlayer.isPlaying ? <PauseIcon/> : <PlayIcon/>}
    </IconButton>
  );
}
