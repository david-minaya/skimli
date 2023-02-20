interface PlaybackId {
  id: string;
  policy: 'public' | 'signed';
}

export interface MuxAsset {
  asset: {
    duration: number;
    playback_ids: PlaybackId[];
  }
  tokens: {
    video: string;
    thumbnail: string;
    storyboard: string;
  }
}
