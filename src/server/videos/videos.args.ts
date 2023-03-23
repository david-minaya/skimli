import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Validate,
  ValidateNested,
} from "class-validator";
import { ArgsType, Field, InputType, Int } from "type-graphql";
import { IsValidFilename } from "../common/filename.validator";
import { IsValidCategory } from "../common/category.validator";
import {
  AcitivityStatus,
  AssetStatus,
  ClipSourceType,
  IAdjustClipArgs,
  ConvertToClipsWorkflowStatus as IConvertToClipsWorkflowStatus,
  ICreateClipArgs,
  IStartMediaUploadArgs,
  MediaType,
} from "../types/videos.types";
import { IsValidClipTitle } from "../common/clip-title.validator";

@ArgsType()
export class StartUploadArgs {
  @Field(() => String)
  @Validate(IsValidFilename)
  @IsString()
  @IsNotEmpty()
  filename: string;
}

@ArgsType()
export class GetPartUploadURLArgs {
  @Field(() => String)
  @IsString()
  key: string;

  @Field(() => Int)
  @IsNumber()
  partNumber: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  uploadId: string;
}

@InputType()
class Part {
  @Field(() => String)
  @IsString()
  ETag: string;

  @Field(() => Int)
  @IsNumber()
  PartNumber: number;
}

@ArgsType()
export class CompleteUploadArgs {
  @Field(() => String)
  @IsString()
  key: string;

  @Field(() => [Part!]!)
  @ValidateNested({ each: true })
  @Type(() => Part)
  parts: Part[];

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  uploadId: string;
}

@ArgsType()
export class AbortUploadArgs {
  @Field(() => String)
  @IsString()
  key: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  uploadId: string;
}

@ArgsType()
export class GetAssetsArgs {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  skip?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  take?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  uuid?: string;
}

@ArgsType()
export class DeleteAssetsArgs {
  @Field(() => [String], { description: "video's uuid field" })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  assetIds: string[];
}

@ArgsType()
export class ConvertToClipsArgs {
  @Field(() => String, { description: "video's uuid field" })
  @IsNotEmpty()
  @IsString()
  assetId: string;

  @Field(() => String, { description: "`code` from video category" })
  @Validate(IsValidCategory)
  @IsNotEmpty()
  @IsString()
  category: string;
}

// TODO: remove once convert to workflow integrated on web-app client
@ArgsType()
export class TestConvertToClipsWorkflowStatusArgs
  implements IConvertToClipsWorkflowStatus
{
  @Field(() => AcitivityStatus)
  activityStatus: AcitivityStatus;

  @Field(() => String)
  assetId: string;

  @Field(() => Int)
  org: number;

  @Field(() => String)
  startTime: string;

  @Field(() => AssetStatus)
  status: AssetStatus;
}

@ArgsType()
export class GetAssetArgs {
  @Field(() => String)
  @IsUUID()
  uuid: string;
}

@ArgsType()
export class StartMediaUploadArgs implements IStartMediaUploadArgs {
  @Field(() => String)
  @Validate(IsValidFilename)
  @IsString()
  @IsNotEmpty()
  filename: string;

  @Field(() => String)
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @Field(() => MediaType)
  @IsEnum(MediaType)
  type: MediaType;

  @Field(() => String)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  languageCode?: string = "en";
}

@ArgsType()
export class GetAssetMediasArgs {
  @Field(() => String, { description: "video asset's uuid" })
  @IsUUID()
  assetId: string;
}

// TODO: update when app-services is ready with the changes
@ArgsType()
export class CreateClipArgs implements ICreateClipArgs {
  @Field(() => String)
  @IsValidClipTitle
  @MaxLength(140)
  @IsString()
  @IsNotEmpty()
  caption: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @Field(() => String)
  @IsUUID()
  assetId: string;

  // @Field(() => String)
  // @IsString()
  // @IsNotEmpty()
  duration: string = "";

  // @Field(() => Int)
  // @IsInt()
  startFrame: number = 0;

  // @Field(() => Int)
  // @IsInt()
  endFrame: number = 0;

  // @Field(() => ClipSourceType)
  source: ClipSourceType = ClipSourceType.HUMAN;
}

@ArgsType()
export class AdjustClipArgs implements IAdjustClipArgs {
  @Field(() => String)
  @IsUUID()
  uuid: string;

  @Field(() => String)
  @IsUUID()
  assetId: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  caption?: string;

  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;
}
