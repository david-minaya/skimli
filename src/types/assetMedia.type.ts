export interface AssetMedia {
  uuid: string;
  org: number;
  name: string;
  type: 'AUTO_SUBTITLE' | 'SUBTITLE' | 'AUDIO' | 'IMAGE';
  status: 'PROCSESSING' | 'READY' | 'ARCHIVED' | 'DELETED' | 'ERRORED';
  createdAt: string;
  updatedAt: string;
  selected: boolean;
  assets: {
    ids: string[];
    count: number;
  }
}
