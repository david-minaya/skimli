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
  inferenceData?: IInferenceData;
  metadata?: AssetMetadata;
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

export interface IAdminGetAssetsArgs {
  take?: number;
  skip?: number;
  name?: string;
  uuid?: string;
  org: number;
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

export enum ClipSourceType {
  MODEL = "MODEL",
  HUMAN = "HUMAN",
  AUTOMATIC = "AUTOMATIC",
}

export interface IClip {
  uuid: string;
  caption?: string;
  startTime: string;
  endTime: string;
  duration: string;
  startFrame: number;
  endFrame: number;
  source: ClipSourceType;
  createdAt: string;
  editedAt: string;
  assetId?: string;
}

export interface IInferenceDataAnalysis {
  clips: IClip[];
  model: string;
  createdAt: string;
}

export interface IHumanInferenceData {
  clips?: string[];
}

export interface IInferenceData {
  human: IHumanInferenceData;
  analysis: IInferenceDataAnalysis;
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

export interface AssetMetadataResolution {
  name: string;
}

export interface AssetMetadataAspectRatio {
  decimal: string;
  dimension: string;
}

export interface AssetMetadata {
  size?: number;
  resolution?: AssetMetadataResolution;
  aspectRatio?: AssetMetadataAspectRatio;
}

export enum MediaType {
  AUDIO = "AUDIO",
  SUBTITLE = "SUBTITLE",
}

export enum MediaStatus {
  PROCSESSING = "PROCSESSING",
  READY = "READY",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
  ERRORED = "ERRORED",
}

export interface IMediaDetails {
  sourceUrl: string;
}

export interface IMediaAssets {
  ids?: string[];
  count: number;
}

export interface IMedia {
  uuid: string;
  org: number;
  name: string;
  details: IMediaDetails;
  type: MediaType;
  status: MediaStatus;
  createdAt: string;
  updatedAt: string;
  assets?: IMediaAssets;
}

export interface IStartMediaUploadArgs {
  filename: string;
  assetId: string;
  type: MediaType;
  languageCode?: string;
}

export interface ICreateMediaArgs {
  name: string;
  type: MediaType;
  details: IMediaDetails;
  status: MediaStatus;
  assets?: { ids: string[]; count: number };
  org: number;
}

export interface IGetAssetMediasArgs {
  // is the video asset id
  assetId?: string;
  // uuid of the media to get media by id
  uuid?: string;
}

export interface ICreateClipArgs {
  caption: string;
  startTime: string;
  endTime: string;
  assetId: string;
  duration: string;
  startFrame: number;
  endFrame: number;
  source: ClipSourceType;
}

export interface IAdjustClipArgs {
  uuid: string;
  assetId: string;
  caption?: string;
  startTime: string;
  endTime: string;
}

export interface IGetClipsArgs {
  uuid?: string;
  skip?: number;
  take?: number;
  caption?: string;
  source?: ClipSourceType;
  uuids?: string[];
}
