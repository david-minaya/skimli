import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidateNested,
} from "class-validator";
import { ArgsType, Field, InputType, Int } from "type-graphql";
import { IsValidFilename } from "../common/filename.validator";
import { IsValidCategory } from "../common/category.validator";
import {
  AcitivityStatus,
  AssetStatus,
  ConvertToClipsWorkflowStatus as IConvertToClipsWorkflowStatus,
} from "../types/videos.types";

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

@ArgsType()
export class ConvertToClipsWorkflowStatusArgs {
  @Field(() => String, { description: "asset uuid" })
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  assetId: string;
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
