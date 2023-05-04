export interface VideoTrack {
  type: 'video';
  width: number;
  height: number;
  duration: number;
  encoding: string;
  frame_rate: number;
}
