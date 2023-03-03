import { MuxAsset } from './muxAsset.type';

export interface Asset {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  org: number;
  name: string;
  status: 'PROCESSING' | 'UNCONVERTED' | 'CONVERTING' | 'CONVERTED' | 'DELETING' | 'ERRORED';
  sourceMuxAssetId?: string;
  selected: boolean;
  mux?: MuxAsset;
}
