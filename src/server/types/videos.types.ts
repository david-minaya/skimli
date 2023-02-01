import { AxiosError } from "axios";

enum AssetStatus {
  PROCESSING,
  UNCONVERTED,
  CONVERTING,
  CONVERTED,
  DELETING,
  ERRORED,
}

export interface Asset {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  org: number;
  name: string;
  status: AssetStatus;
  sourceUrl: string;
  sourceMuxAssetId: string;
  sourceMuxInputInfo: Object;
  sourceMuxAssetData: Object;
}

export interface CreateAssetRequest {
  name: string;
  status: AssetStatus;
  sourceUrl: string;
  sourceMuxAssetId?: string;
  sourceMuxInputInfo?: string;
  sourceMuxAssetData?: string;
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {}

export type CreateAssetResponse = [Asset | null, AxiosError | null];
export type UpdateAssetResponse = CreateAssetResponse;
