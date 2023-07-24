import { Crop } from './crop.type';

export interface VideoAsset {
  type: 'video';
  src: string;
  trim?: number;
  volume?: number;
  volumeEffect?: 'fadeIn' | 'fadeOut' | 'fadeInFadeOut';
  crop?: Crop;
}
