interface PlaybackId {
  id: string;
  policy: 'public' | 'signed';
}

export interface MuxAsset {
  asset: {
    duration: number;
    created_at: string;
    playback_ids: PlaybackId[];
  }
  tokens: {
    video: string;
    thumbnail: string;
    storyboard: string;
  }
}
