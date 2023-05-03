export interface AssetMedia {
  uuid: string;
  org: number;
  name: string;
  type: 'SUBTITLE';
  status: 'PROCSESSING' | 'READY' | 'ARCHIVED' | 'DELETED' | 'ERRORED';
  createdAt: string;
  updatedAt: string;
  details: {
    sourceUrl: string;
  }
  assets: {
    ids: string[];
    count: number;
  }
}
