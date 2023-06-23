import { AssetMedia } from './assetMedia.type';

export interface ImageMedia extends AssetMedia {
  details: {
    sourceUrl: string;
    cdnUrl: string;
  }
}
