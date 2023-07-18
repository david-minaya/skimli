import { useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react';

interface Props {
  children: ReactNode;
}

interface Mutable {
  video?: HTMLVideoElement; 
  onLoad?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onProgress?: (progress: number) => void;
  onUpdateProgress?: (progress: number) => void;
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
  setCurrentTime: (time: number) => void;
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
  onPlay: (cb: () => void) => void;
  onPause: (cb: () => void) => void;
  onProgress: (cb: (progress: number) => void) => void;
  onUpdateProgress: (cb: (progress: number) => void) => void;
}

const Context = createContext({} as VideoPlayer);

export function VideoPlayerProvider(props: Props) {

  const { children } = props;
  
  const [ctx] = useState<Mutable>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, _setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [loop, setLoop] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  
  function setVideo(video?: HTMLVideoElement) {
    ctx.video = video;
    if (video) ctx.onLoad?.();
  }

  function play() {
    ctx.onPlay?.();
    ctx.video?.play();
    setIsPlaying(true);
  }

  function pause() {
    ctx.onPause?.();
    ctx.video?.pause();
    setIsPlaying(false);
  }

  function updateProgress(progress: number) {
    ctx.video!.currentTime = progress;
    setCurrentTime(progress);
    ctx.onUpdateProgress?.(progress);
  }

  function setCurrentTime(time: number) {
    _setCurrentTime(time);
    ctx.onProgress?.(time);
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

  function onLoad(cb: () => void) {
    ctx.onLoad = cb;
  }

  function onPlay(cb: () => void) {
    ctx.onPlay = cb;
  }

  function onPause(cb: () => void) {
    ctx.onPause = cb;
  }

  function onProgress(cb: (progress: number) => void) {
    ctx.onProgress = cb;
  }

  function onUpdateProgress(cb: (progress: number) => void) {
    ctx.onUpdateProgress = cb;
  }

  const value: VideoPlayer = {
    get video() { return ctx.video; },
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
    onLoad,
    onPlay,
    onPause,
    onProgress,
    onUpdateProgress
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

export function useVideoPlayer() {
  return useContext(Context);
}
