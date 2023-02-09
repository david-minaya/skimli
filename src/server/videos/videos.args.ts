import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Validate,
  ValidateNested,
} from "class-validator";
import { ArgsType, Field, InputType, Int } from "type-graphql";
import { IsValidFilename } from "../common/filename.validator";

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
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => String, { nullable: true })
  name?: string;
}

@ArgsType()
export class DeleteAssetsArgs {
  @Field(() => [String!]!, { description: "video's uuid field" })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  assetIds: string[];
}
