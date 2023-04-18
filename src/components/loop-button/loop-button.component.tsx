import { IconButton } from '@mui/material';
import { LoopIcon } from '~/icons/loopIcon';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';

export function LoopButton() {

  const videoPlayer = useVideoPlayer();

  function handleLoop() {
    videoPlayer.setLoop(loop => {
      if (loop) {
        videoPlayer.pause();
        return false;
      } else {
        videoPlayer.play();
        return true;
      }
    })
  }

  return (
    <IconButton 
      size='small'
      onClick={handleLoop}>
      <LoopIcon/>
    </IconButton>
  );
}
