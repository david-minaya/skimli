import { InputInfo, Asset as MuxAsset } from "@mux/mux-node";
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
  sourceMuxInputInfo?: InputInfo[];
  sourceMuxAssetData?: object;
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {
  status: AssetStatus;
}

export type CreateAssetResponse = [Asset | null, AxiosError | null];
export type UpdateAssetResponse = CreateAssetResponse;

export interface GetAssetsArgs {
  take?: number;
  skip?: number;
  name?: string;
}
