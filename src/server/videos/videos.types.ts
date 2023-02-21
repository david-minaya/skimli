import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import { Asset as BaseAsset } from "../types/videos.types";
import { MuxTokens } from "../mux/mux.types";
import { MuxAsset } from "../mux/mux.types";

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

export enum AssetStatus {
  PROCESSING = "PROCESSING",
  UNCONVERTED = "UNCONVERTED",
  CONVERTING = "CONVERTING",
  CONVERTED = "CONVERTED",
  DELETING = "DELETING",
  ERRORED = "ERRORED",
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

@ObjectType()
export class Asset implements BaseAsset {
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

  // not exposing this field
  // @Field(() => GraphQLJSON)
  sourceMuxInputInfo: object;

  // not exposing this field
  // @Field(() => GraphQLJSON)
  sourceMuxAssetData: object;

  @Field(() => MuxData, { nullable: true })
  mux?: MuxData;
}
