import { AudioAsset } from './audioAsset.type';
import { ImageAsset } from './imageAsset.type';
import { VideoAsset } from './videoAsset.type';

export interface Clip<T = VideoAsset | ImageAsset | AudioAsset> {
  start: number;
  length: number;
  fit?: 'crop' | 'cover' | 'contain' | 'none',
  scale?: number;
  position?: 'top' | 'topRight' |'right' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'left' | 'topLeft' | 'center';
  offset?: { x?: number; y?: number; }
  opacity?: number;
  asset: T;
  sources?: {
    id: string;
    title: string;
    duration?: number;
  }
}
