import GraphQLJSON from "graphql-type-json";
import {
  Field,
  Float,
  Int,
  ObjectType,
  createUnionType,
  registerEnumType,
} from "type-graphql";
import { MuxAsset, MuxTokens } from "../mux/mux.types";
import {
  AcitivityStatus,
  AssetStatus,
  Asset as IAsset,
  Clip as IClip,
  ConvertToClipsWorkflowResponse as IConvertToClipsWorkflowResponse,
  ConvertToClipsWorkflowStatus as IConvertToClipsWorkflowStatus,
  InferenceData as IInferenceData,
  SourceMuxInput as ISourceMuxInput,
  SourceMuxInputFile as ISourceMuxInputFile,
  SourceMuxInputSettings as ISourceMuxInputSettings,
  SourceMuxInputTrack as ISourceMuxInputTrack,
  AssetMetadataResolution as IAssetMetadataResolution,
  AssetMetadataAspectRatio as IAssetMetadataAspectRatio,
  AssetMetadata as IAssetMetadata,
} from "../types/videos.types";

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

registerEnumType(AssetStatus, {
  name: "AssetStatus",
});

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

registerEnumType(AcitivityStatus, {
  name: "AcitivityStatus",
});

@ObjectType()
export class Clip implements IClip {
  @Field(() => Int)
  startFrame: number;

  @Field(() => Int)
  endFrame: number;

  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;

  @Field(() => String)
  duration: string;

  @Field(() => String)
  source: string;

  @Field(() => String)
  model: string;

  @Field(() => String)
  moment: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  title?: string;
}

@ObjectType()
export class InferenceDataAnalysis {
  @Field(() => [Clip!]!)
  clips: Clip[];
}

@ObjectType()
export class InferenceData implements IInferenceData {
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
  @Field(() => AssetMetadataResolution)
  resolution: AssetMetadataResolution;

  @Field(() => AssetMetadataAspectRatio)
  aspectRatio: AssetMetadataAspectRatio;
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
  sourceMuxAssetId: string;

  @Field(() => [SourceMuxInput])
  sourceMuxInputInfo: SourceMuxInput[];

  // not exposing this field
  // @Field(() => GraphQLJSON)
  sourceMuxAssetData: object;

  @Field(() => MuxData, { nullable: true })
  mux?: MuxData;

  @Field(() => String, { nullable: true })
  activityStartTime?: string;

  @Field(() => AcitivityStatus, { nullable: true })
  activityStatus?: AcitivityStatus;

  @Field(() => GraphQLJSON, { nullable: true })
  medias?: object;

  @Field(() => InferenceData, { nullable: true })
  inferenceData?: InferenceData;

  @Field(() => AssetMetadata, { nullable: true })
  metadata?: AssetMetadata;
}

@ObjectType()
export class SourceMuxInputFile implements ISourceMuxInputFile {
  @Field(() => [SourceMuxInputTrackType])
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
  @Field(() => AcitivityStatus, { nullable: true })
  activityStatus?: AcitivityStatus;

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
