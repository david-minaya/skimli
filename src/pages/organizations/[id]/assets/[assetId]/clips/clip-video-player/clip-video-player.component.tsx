import MuxVideo from '@mux/mux-video-react';
import { useRef, useEffect, useState, SyntheticEvent } from 'react';
import { Box, ClickAwayListener, IconButton, LinearProgress, Popper, Slider, styled } from '@mui/material';
import { style } from './clip-video-player.style';
import { Asset } from '~/types/assets.type';
import { Clip } from '~/types/clips.type';
import { PlayIcon } from '~/icons/playIcon';
import { PauseIcon } from '~/icons/pauseIcon';
import { formatSeconds } from '~/utils/formatSeconds';
import { VolumeIcon } from '~/icons/volumeIcon';
import { MuteIcon } from '~/icons/muteIcon';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeRef = useRef<HTMLButtonElement>(null);
  const [play, setPlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = clip.startTime;
    }
  }, [clip])

  function handlePlayed() {
    setPlay(true);
  }

  function handlePaused() {
    setPlay(false);
  }

  function handleWaiting() {
    setPlay(false);
  }

  function handlePlaying() {
    setPlay(true);
  }

  function handleVolumeChange() {
    setVolume(videoRef.current!.volume * 100);
    setMuted(videoRef.current!.volume <= 0 || videoRef.current!.muted);
  }

  function handleTimeUpdate(event: SyntheticEvent<HTMLVideoElement>) {

    if (videoRef.current!.currentTime >= clip.endTime) {
      videoRef.current!.currentTime = clip.startTime;
    }

    setProgress(videoRef.current!.currentTime - clip.startTime);
  }

  function handlePlay() {
    if (videoRef.current!.paused) {
      videoRef.current!.play();
    } else {
      videoRef.current!.pause();   
    }
  }
  
  function handleUpdateVolume(event: Event, value: number | number[]) {
    videoRef.current!.volume = (value as number) / 100;
    videoRef.current!.muted = value <= 0;
  }
  
  function handleMute() {
    videoRef.current!.muted = !videoRef.current!.muted;
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
        onTimeUpdate={handleTimeUpdate}
        onVolumeChange={handleVolumeChange}/>
      <LinearProgress
        variant='determinate'
        value={progress * 100 / clip.duration}/>
      <Box sx={style.controls}>
        <IconButton
          sx={style.playButton} 
          size='small'
          onClick={handlePlay}>
          {play ? <PauseIcon/> : <PlayIcon/>}
        </IconButton>
        <Box sx={style.time}>
          {formatSeconds(progress)} / {formatSeconds(clip.duration)}
        </Box>
        <ClickAwayListener
          mouseEvent='onMouseDown' 
          onClickAway={() => setShowVolume(false)}>
          <Box
            sx={style.volumeOption}>
            <IconButton
              size='small'
              ref={volumeRef}
              onClick={() => setShowVolume(show => !show)}>
              {muted ? <MuteIcon/> : <VolumeIcon/>}
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
                value={!muted ? volume : 0}
                onChange={handleUpdateVolume}/>
              <IconButton 
                onClick={handleMute}>
                {muted ? <MuteIcon/> : <VolumeIcon/>}
              </IconButton>
            </Popper>
          </Box>
        </ClickAwayListener>
      </Box>
    </Box>
  )
}