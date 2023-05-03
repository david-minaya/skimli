import GraphQLJSON from "graphql-type-json";
import {
  Field,
  Float,
  Int,
  ObjectType,
  UseMiddleware,
  createUnionType,
  registerEnumType,
} from "type-graphql";
import { TransformCategoryCodeToLabel } from "../middlewares/transform-category-code";
import { TransformClipsCaption } from "../middlewares/transform-clips-caption";
import { MuxAsset, MuxTokens } from "../mux/mux.types";
import {
  ActivityStatus,
  AssetStatus,
  ClipSourceType,
  Asset as IAsset,
  AssetMetadata as IAssetMetadata,
  AssetMetadataAspectRatio as IAssetMetadataAspectRatio,
  AssetMetadataResolution as IAssetMetadataResolution,
  IAssetWorkflow,
  IClip,
  IClipDetails,
  IClipDetailsRender,
  ConvertToClipsWorkflowResponse as IConvertToClipsWorkflowResponse,
  ConvertToClipsWorkflowStatus as IConvertToClipsWorkflowStatus,
  IInferenceData,
  IInferenceDataAnalysis,
  IMedia,
  IMediaAssets,
  IMediaDetails,
  IRenderClipResponse,
  SourceMuxInput as ISourceMuxInput,
  SourceMuxInputFile as ISourceMuxInputFile,
  SourceMuxInputSettings as ISourceMuxInputSettings,
  SourceMuxInputTrack as ISourceMuxInputTrack,
  MediaStatus,
  MediaType,
  RenderClipQuality,
  SubAssetStatus,
} from "../types/videos.types";

registerEnumType(AssetStatus, {
  name: "AssetStatus",
});

registerEnumType(ActivityStatus, {
  name: "AcitivityStatus",
});

registerEnumType(ClipSourceType, {
  name: "ClipSourceType",
});

registerEnumType(RenderClipQuality, {
  name: "RenderClipQuality",
});

@ObjectType()
export class StartUploadResponse {
  @Field(() => String)
  key: string;

  @Field(() => String)
  uploadId: string;
}

@ObjectType()
export class GetPartUploadResponse {
  @Field(() => String)
  url: string;
}

@ObjectType()
export class AssetUploadResponse {
  @Field(() => AssetStatus)
  status: AssetStatus;

  @Field(() => String, { nullable: true })
  assetId?: string;
}

export interface AssetUploads {
  status: AssetStatus;
  assetId?: string;
  org?: number;
}

@ObjectType()
export class MuxData {
  @Field(() => MuxAsset, { nullable: true })
  asset?: MuxAsset;

  @Field(() => MuxTokens, { nullable: true })
  tokens?: MuxTokens;
}

@ObjectType()
export class ClipDetailsRender implements IClipDetailsRender {
  @Field(() => RenderClipQuality)
  quality: RenderClipQuality;

  @Field(() => Boolean)
  muteAudio: boolean;

  @Field(() => String)
  url: string;
}

@ObjectType()
export class ClipDetails implements IClipDetails {
  @Field(() => [ClipDetailsRender], { nullable: true })
  renders: ClipDetailsRender[];
}

@ObjectType()
export class Clip implements IClip {
  @Field(() => String)
  uuid: string;

  @Field(() => String, { nullable: true })
  caption?: string | undefined;

  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;

  @Field(() => String)
  duration: string;

  @Field(() => Int)
  startFrame: number;

  @Field(() => Int)
  endFrame: number;

  @Field(() => ClipSourceType)
  source: ClipSourceType;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  editedAt: string;

  @Field(() => String, { nullable: true })
  assetId?: string;

  @Field(() => ClipDetails, { nullable: true })
  details?: ClipDetails;
}

@ObjectType()
export class InferenceDataAnalysis implements IInferenceDataAnalysis {
  @Field(() => [Clip!]!)
  @UseMiddleware(TransformClipsCaption())
  clips: Clip[];

  @Field(() => String)
  model: string;

  @Field(() => String)
  createdAt: string;
}

@ObjectType()
export class HumanInferenceData {
  @Field(() => [Clip], { nullable: true })
  clips?: Clip[];
}

@ObjectType()
export class InferenceData implements IInferenceData {
  @Field(() => HumanInferenceData)
  human: HumanInferenceData;

  @Field(() => InferenceDataAnalysis)
  analysis: InferenceDataAnalysis;
}

@ObjectType()
export class AssetMetadataResolution implements IAssetMetadataResolution {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class AssetMetadataAspectRatio implements IAssetMetadataAspectRatio {
  @Field(() => String)
  decimal: string;

  @Field(() => String)
  dimension: string;
}

@ObjectType()
export class AssetMetadata implements IAssetMetadata {
  @Field(() => Float, {
    nullable: true,
    name: "filesize",
    description: "filesize in bytes",
  })
  size?: number;

  @Field(() => AssetMetadataResolution, { nullable: true })
  resolution?: AssetMetadataResolution;

  @Field(() => AssetMetadataAspectRatio, { nullable: true })
  aspectRatio?: AssetMetadataAspectRatio;
}

@ObjectType()
export class AssetWorkflow implements IAssetWorkflow {
  @Field(() => String)
  workflowId: string;

  @Field(() => String)
  runId: string;

  @Field(() => AssetStatus)
  status: AssetStatus;

  @Field(() => String)
  @UseMiddleware(TransformCategoryCodeToLabel())
  category: string;

  @Field(() => ActivityStatus)
  activityStatus: ActivityStatus;

  @Field(() => String, { nullable: true })
  startTime?: string;

  @Field(() => String, { nullable: true })
  endTime?: string;

  @Field(() => String, { nullable: true })
  model?: string;
}

@ObjectType()
export class Asset implements IAsset {
  @Field(() => String)
  uuid: string;

  @Field(() => String, { nullable: true })
  createdAt: string;

  @Field(() => String, { nullable: true })
  updatedAt: string;

  @Field(() => Int)
  org: number;

  @Field(() => String)
  name: string;

  @Field(() => AssetStatus)
  status: AssetStatus;

  // not exposing this field
  // @Field(() => String)
  sourceUrl: string;

  @Field(() => String, { nullable: true })
  sourceMuxAssetId?: string;

  @Field(() => [SourceMuxInput], { nullable: true })
  sourceMuxInputInfo?: SourceMuxInput[];

  // not exposing this field
  // @Field(() => GraphQLJSON)
  sourceMuxAssetData?: object;

  @Field(() => MuxData, { nullable: true })
  mux?: MuxData;

  @Field(() => String, { nullable: true })
  activityStartTime?: string;

  @Field(() => ActivityStatus, { nullable: true })
  activityStatus?: ActivityStatus;

  @Field(() => GraphQLJSON, { nullable: true })
  medias?: object;

  @Field(() => InferenceData, { nullable: true })
  inferenceData?: InferenceData;

  @Field(() => AssetMetadata, { nullable: true })
  metadata?: AssetMetadata;

  @Field(() => [AssetWorkflow], { nullable: true })
  workflows?: AssetWorkflow[];
}

@ObjectType()
export class SourceMuxInputFile implements ISourceMuxInputFile {
  @Field(() => [SourceMuxInputTrackType], { nullable: true })
  tracks: SourceMuxInputTrack[];

  @Field(() => String)
  container_format: string;
}

@ObjectType()
export class SourceMuxInputTrack implements ISourceMuxInputTrack {
  @Field(() => String)
  type: string;

  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => Float)
  duration: number;

  @Field(() => String)
  encoding: string;

  @Field(() => Float, { nullable: true })
  frame_rate?: number;

  @Field(() => String, { nullable: true })
  channels?: number;

  @Field(() => Float, { nullable: true })
  sample_rate?: number;
}

@ObjectType()
export class SourceMuxInputSettings implements ISourceMuxInputSettings {
  @Field(() => String)
  url: string;
}

@ObjectType()
export class SourceMuxInputAudioTrack implements ISourceMuxInputTrack {
  @Field(() => String)
  type: string;

  @Field(() => Float)
  duration: number;

  @Field(() => String)
  encoding: string;

  @Field(() => String)
  channels: number;

  @Field(() => Float)
  sample_rate: number;
}

@ObjectType()
export class SourceMuxInputVideoTrack {
  @Field(() => String)
  type: string;

  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field(() => Float)
  duration: number;

  @Field(() => String)
  encoding: string;

  @Field(() => Float)
  frame_rate: number;
}

export const SourceMuxInputTrackType = createUnionType({
  name: "SourceMuxInputTrackType",
  types: () => [SourceMuxInputAudioTrack, SourceMuxInputVideoTrack],
  resolveType: (value: any) => {
    if (value.type == "audio") {
      return SourceMuxInputAudioTrack;
    } else {
      return SourceMuxInputVideoTrack;
    }
  },
});

@ObjectType()
export class SourceMuxInput implements ISourceMuxInput {
  @Field(() => SourceMuxInputFile)
  file: SourceMuxInputFile;

  // not exposing this field
  // @Field(() => SourceMuxInputSettings)
  settings: SourceMuxInputSettings;
}

@ObjectType()
export class ConvertToClipsWorkflowStatus
  implements IConvertToClipsWorkflowStatus
{
  @Field(() => ActivityStatus, { nullable: true })
  activityStatus?: ActivityStatus;

  @Field(() => AssetStatus, { nullable: true })
  status?: AssetStatus;

  @Field(() => String, { description: "asset's uuid" })
  assetId: string;

  // @Field(() => Int)
  org: number;

  @Field(() => String, {
    description: "time when workflow started in ISO format",
  })
  startTime: string;
}

@ObjectType()
export class ConvertToClipsWorkflowResponse
  implements IConvertToClipsWorkflowResponse
{
  @Field(() => String, {
    description:
      "id of the workflow. it can be constructed using WORKFLOW_NAME_ASSET_UUID",
  })
  workflow: string;

  @Field(() => String, { description: "asset's uuid" })
  asset: string;
}

registerEnumType(MediaType, { name: "MediaType" });
registerEnumType(MediaStatus, { name: "MediaStatus" });

@ObjectType()
export class MediaDetails implements IMediaDetails {
  @Field(() => String)
  sourceUrl: string;
}

@ObjectType()
export class MediaAssets implements IMediaAssets {
  @Field(() => [String], { nullable: true })
  ids?: string[];

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class Media implements IMedia {
  @Field(() => String)
  uuid: string;

  @Field(() => Int)
  org: number;

  @Field(() => String)
  name: string;

  @Field(() => MediaDetails, { nullable: true })
  details: MediaDetails;

  @Field(() => MediaType)
  type: MediaType;

  @Field(() => MediaStatus)
  status: MediaStatus;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;

  @Field(() => MediaAssets, { nullable: true })
  assets?: MediaAssets;
}

@ObjectType()
export class RenderClipResponse implements IRenderClipResponse {
  // @Field(() => Int)
  org: number;

  @Field(() => String, { description: "video asset uuid" })
  parentId: string;

  @Field(() => String, { description: "uuid of the clip" })
  clipId: string;

  @Field(() => String)
  status: SubAssetStatus;

  @Field(() => String, {
    description: "download link to rendered clip",
    nullable: true,
  })
  downloadUrl?: string;
}

@ObjectType()
export class ParsedVttLine {
  @Field(() => Float)
  startTime: number;

  @Field(() => Float)
  endTime: number;

  @Field(() => String)
  text: string;
}
