import { InputInfo } from "@mux/mux-node";
import { AxiosError } from "axios";

export enum AssetStatus {
  PROCESSING = "PROCESSING",
  UNCONVERTED = "UNCONVERTED",
  CONVERTING = "CONVERTING",
  CONVERTED = "CONVERTED",
  DELETING = "DELETING",
  ERRORED = "ERRORED",
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
  sourceMuxInputInfo: SourceMuxInput[];
  sourceMuxAssetData: object;
  activityStartTime?: string;
  activityStatus?: AcitivityStatus;
  medias?: object;
  inferenceData?: InferenceData;
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
  uuid?: string;
}

export enum AcitivityStatus {
  QUEUED = "QUEUED",
  DOWNLOADING = "DOWNLOADING",
  ANALYZING = "ANALYZING",
  ASSEMBLING = "ASSEMBLING",
  PUBLISHING = "PUBLISHING",
  FINISHED = "FINISHED",
}

export interface ConvertToClipsArgs {
  assetId: string;
  category: string;
  userId?: string;
}

export interface Clip {
  // int
  startFrame: number;
  // int
  endFrame: number;
  startTime: string;
  endTime: string;
  duration: string;
  source: string;
  model: string;
  moment: string;
  createdAt?: string;
}

export interface InferenceDataAnalysis {
  clips: Clip[];
}

export interface InferenceData {
  analysis: InferenceDataAnalysis;
}

export interface SourceMuxInput {
  file: SourceMuxInputFile;
  settings: SourceMuxInputSettings;
}

export interface SourceMuxInputFile {
  tracks: SourceMuxInputTrack[];
  container_format: string;
}

export interface SourceMuxInputTrack {
  type: string;
  width?: number;
  height?: number;
  duration: number;
  encoding: string;
  frame_rate?: number;
  channels?: number;
  sample_rate?: number;
}

export interface SourceMuxInputSettings {
  url: string;
}

export interface ConvertToClipsWorkflowResponse {
  workflow: string;
  asset: string;
}

export interface ConvertToClipsWorkflowStatus {
  activityStatus?: AcitivityStatus;
  assetId: string;
  org: number;
  startTime: string;
  status?: AssetStatus;
}

export interface DeleteAssetArgs {
  assetIds: string[];
  userId: string;
  token: string;
}
