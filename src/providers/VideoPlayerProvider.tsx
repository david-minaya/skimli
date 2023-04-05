import { useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react';

interface Props {
  children: ReactNode;
}

interface VideoPlayer {
  video?: HTMLVideoElement;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  muted: boolean;
  loop: boolean;
  setVideo: (video: HTMLVideoElement) => void;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setLoop: Dispatch<SetStateAction<boolean>>;
  play: () => void;
  pause: () => void;
  mute: () => void;
  updateProgress: (progress: number) => void;
  updateVolume: (volume: number) => void;
}

const Context = createContext({} as VideoPlayer);

export function VideoPlayerProvider(props: Props) {

  const { children } = props;

  const [ctx] = useState<{ video?: HTMLVideoElement }>({ video: undefined });
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [loop, setLoop] = useState(false);

  function setVideo(video: HTMLVideoElement) {
    ctx.video = video;
  }

  function play() {
    ctx.video?.play();
    setIsPlaying(true);
  }

  function pause() {
    ctx.video?.pause();
    setIsPlaying(false);
  }

  function updateProgress(progress: number) {
    ctx.video!.currentTime = progress;
    setCurrentTime(progress);
  }

  function updateVolume(volume: number) {
    ctx.video!.volume = volume / 100;
    ctx.video!.muted = volume <= 0;
    setVolume(volume);
    setMuted(volume <= 0);
  }

  function mute() {
    ctx.video!.muted = !ctx.video!.muted;
    setMuted(ctx.video!.muted);
  }

  const value: VideoPlayer = {
    video: ctx.video,
    isPlaying,
    currentTime,
    volume,
    muted,
    loop,
    setVideo,
    setCurrentTime,
    setIsPlaying,
    setLoop,
    play,
    pause,
    mute,
    updateProgress,
    updateVolume,
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

export function useVideoPlayer() {
  return useContext(Context);
}
