import { AssetMedia } from './assetMedia.type';

export interface AudioAssetMedia extends AssetMedia {
  details: {
    sourceUrl: string;
    muxAssetId: string;
    playbackId: string;
  }
}
