import MuxVideo from '@mux/mux-video-react';
import { useRef, useEffect, useState } from 'react';
import { Box, ClickAwayListener, IconButton, LinearProgress, Popper, Slider, styled } from '@mui/material';
import { style } from './clip-video-player.style';
import { Asset } from '~/types/assets.type';
import { Clip } from '~/types/clip.type';
import { PlayIcon } from '~/icons/playIcon';
import { PauseIcon } from '~/icons/pauseIcon';
import { formatSeconds } from '~/utils/formatSeconds';
import { VolumeIcon } from '~/icons/volumeIcon';
import { MuteIcon } from '~/icons/muteIcon';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { LoopIcon } from '~/icons/loopIcon';

const Video = styled(MuxVideo)``;

interface Props {
  asset: Asset;
  clip: Clip;
}

export function ClipVideoPlayer(props: Props) {

  const { 
    asset,
    clip
  } = props;

  const videoPlayer = useVideoPlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeRef = useRef<HTMLButtonElement>(null);
  const [showVolume, setShowVolume] = useState(false);
  const time = videoPlayer.currentTime - clip.startTime;

  useEffect(() => {
    if (videoRef.current) {
      videoPlayer.setVideo(videoRef.current, 'clip-video-player');
      videoPlayer.updateProgress(clip.startTime);
    }
  }, [clip]);

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

    if (videoPlayer.video && videoPlayer.video.currentTime > clip.endTime) {
      
      videoPlayer.updateProgress(clip.startTime);

      if (videoPlayer.loop) {
        videoPlayer.play();
      } else {
        videoPlayer.pause();
      }

      return;
    }
    
    videoPlayer.setCurrentTime(videoPlayer.video!.currentTime);
  }

  function handlePlay() {
    if (videoPlayer.video?.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();   
    }
  }
  
  function handleUpdateVolume(event: Event, value: number | number[]) {
    videoPlayer.updateVolume(value as number);
  }

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
  
  function handleMute() {
    videoPlayer.mute();
  }

  return (
    <Box
      sx={style.container} 
      ref={containerRef}>
      {/* @ts-ignore */}
      <Video
        sx={style.video}
        ref={videoRef}
        playsInline={true}
        playbackId={`${asset.mux?.asset.playback_ids[0].id}?token=${asset.mux?.tokens.video}`}
        onClick={handlePlay}
        onPlay={handlePlayed}
        onPause={handlePaused}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onTimeUpdate={handleTimeUpdate}/>
      <LinearProgress
        variant='determinate'
        value={time * 100 / clip.duration}/>
      <Box sx={style.controls}>
        <IconButton
          sx={style.playButton} 
          size='small'
          onClick={handlePlay}>
          {videoPlayer.isPlaying ? <PauseIcon/> : <PlayIcon/>}
        </IconButton>
        <Box sx={style.time}>
          {formatSeconds(time)} / {formatSeconds(clip.duration)}
        </Box>
        <IconButton 
          size='small'
          onClick={handleLoop}>
          <LoopIcon/>
        </IconButton>
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
      </Box>
    </Box>
  );
}