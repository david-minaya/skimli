import { AssetMedia } from './assetMedia.type';

export interface SubtitleAssetMedia extends AssetMedia {
  details: {
    sourceUrl: string;
  }
}
