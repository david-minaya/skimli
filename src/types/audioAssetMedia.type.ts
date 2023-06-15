import { AssetMedia } from './assetMedia.type';

export interface AudioAssetMedia extends AssetMedia {
  details: {
    sourceUrl: string;
    muxAssetId: string;
    muxToken: string;
    playbackId: string;
    shotstack: {
      id: string;
      url: string;
      status: string;
      render: string;
    }
  }
}
