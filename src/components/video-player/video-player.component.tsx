import MuxVideo from '@mux/mux-video-react';
import { useCallback } from 'react';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { round } from '~/utils/round';
import { styled } from '@mui/material';
import { SxProps, Theme } from "@mui/system";
import { Asset } from '~/types/assets.type';
import { style } from './video-player.style';
import { mergeSx } from '~/utils/style';

const Video = styled(MuxVideo)``;

interface Props {
  sx?: SxProps<Theme>;
  asset: Asset;
  onTimeUpdate?: (time: number) => void;
}

export function VideoPlayer(props: Props) {

  const {
    sx,
    asset,
    onTimeUpdate
  } = props;

  const videoPlayer = useVideoPlayer();

  const handleVideoRef = useCallback((element?: HTMLVideoElement) => {
    if (element && !videoPlayer.video) {
      videoPlayer.setVideo(element);
    }
  }, []);

  function handleDurationChange() {
    videoPlayer.setDuration(videoPlayer.video?.duration || 0);
  }

  function handlePlayed() {
    videoPlayer.setIsPlaying(true);
  }

  function handlePlaying() {
    videoPlayer.setIsPlaying(true);
  }

  function handlePaused() {
    videoPlayer.setIsPlaying(false);
  }

  function handleWaiting() {
    videoPlayer.setIsPlaying(false);
  }

  function handleTimeUpdate() {

    if (onTimeUpdate) {
      onTimeUpdate(round(videoPlayer.video!.currentTime, 3));
      return;
    }
    
    videoPlayer.setCurrentTime(round(videoPlayer.video!.currentTime, 3));
  }

  function handlePlay() {
    if (videoPlayer.video?.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();   
    }
  }

  return (
    // @ts-ignore
    <Video
      sx={mergeSx(style.video, sx)}
      ref={handleVideoRef}
      playsInline={true}
      playbackId={
        !videoPlayer.isReloading 
          ? `${asset.mux?.asset.playback_ids[0].id}?token=${asset.mux?.tokens.video}` 
          : undefined
      }
      onClick={handlePlay}
      onPlay={handlePlayed}
      onPause={handlePaused}
      onWaiting={handleWaiting}
      onPlaying={handlePlaying}
      onTimeUpdate={handleTimeUpdate}
      onDurationChange={handleDurationChange}/>
  );
}
