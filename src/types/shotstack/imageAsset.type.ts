import { Crop } from './crop.type';

export interface ImageAsset {
  type: 'image';
  src: string;
  crop?: Crop;
}
