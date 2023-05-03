import { useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react';

interface Props {
  name?: string;
  children: ReactNode;
}

interface VideoPlayer {
  video?: HTMLVideoElement;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  loop: boolean;
  isReloading: boolean;
  setVideo: (video: HTMLVideoElement, tag?: string) => void;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setDuration: Dispatch<SetStateAction<number>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setLoop: Dispatch<SetStateAction<boolean>>;
  play: () => void;
  pause: () => void;
  mute: () => void;
  reload: () => void;
  updateProgress: (progress: number) => void;
  updateVolume: (volume: number) => void;
  onLoad: (cb: () => void) => void;
}

const Context = createContext({} as VideoPlayer);

export function VideoPlayerProvider(props: Props) {

  const { children, name } = props;

  const [ctx] = useState<{ video?: HTMLVideoElement, onLoad?: () => void }>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [loop, setLoop] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isReloading, setIsReloading] = useState(false);

  function setVideo(video?: HTMLVideoElement, tag?: string) {
    ctx.video = video;
    if (video) ctx.onLoad?.();
  }

  function onLoad(cb: () => void) {
    ctx.onLoad = cb;
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

  function reload() {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 16);
  }

  const value: VideoPlayer = {
    get video() { return ctx.video },
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    loop,
    isReloading,
    setVideo,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setLoop,
    play,
    pause,
    mute,
    reload,
    updateProgress,
    updateVolume,
    onLoad
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
