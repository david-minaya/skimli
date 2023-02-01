import { Field, ObjectType, registerEnumType } from "type-graphql";

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
  org?: string;
}
