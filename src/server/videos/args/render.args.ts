import { IsEnum, IsNumber, IsUUID, Max, Min } from "class-validator";
import {
  ArgsType,
  Field,
  Float,
  InputType,
  registerEnumType,
} from "type-graphql";
import {
  ClipFit,
  ClipPosition,
  IRenderTimelineClip,
  IRenderTimelineClipAsset,
  IRenderTimelineClipCrop,
  RenderTimelineClipAssetType,
} from "../../types/render.types";
import GraphQLJSON from "graphql-type-json";

registerEnumType(RenderTimelineClipAssetType, {
  name: "RenderTimelineClipAssetType",
  description: "allowed values [video, audio, html]",
});

registerEnumType(ClipFit, {
  name: "ClipFit",
  description: "how to fit the clip",
});

registerEnumType(ClipPosition, {
  name: "ClipPosition",
  description: "position of the clip",
});

/*
  https://shotstack.io/docs/api/
*/

@InputType()
export class RenderTimelineClipCrop implements IRenderTimelineClipCrop {
  @Field(() => Float, { nullable: true })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  top?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  bottom?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  left?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  right?: number;
}

@InputType()
export class RenderTimelineClipAsset implements IRenderTimelineClipAsset {
  @Field(() => RenderTimelineClipAssetType)
  @IsEnum(RenderTimelineClipAssetType)
  type: RenderTimelineClipAssetType;

  @Field(() => Float)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  @Max(1)
  volume: number;

  @Field(() => Float)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  trim: number;

  @Field(() => String)
  src: string;

  @Field(() => String, {
    nullable: true,
    description: "required if type is html",
  })
  html?: string;

  @Field(() => String, { nullable: true })
  css?: string;

  @Field(() => String, { nullable: true })
  background?: string;

  @Field(() => String, { nullable: true })
  size?: string;

  @Field(() => RenderTimelineClipCrop, { nullable: true })
  crop?: RenderTimelineClipCrop;
}

@InputType()
export class RenderTimelineClip implements IRenderTimelineClip {
  @Field(() => RenderTimelineClipAsset)
  asset: RenderTimelineClipAsset;

  @Field(() => Float)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  start: number;

  @Field(() => Float)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  length: number;

  @Field(() => ClipFit, { nullable: true })
  @IsEnum(ClipFit)
  fit?: ClipFit;

  @Field(() => ClipPosition, { nullable: true })
  @IsEnum(ClipPosition)
  position?: ClipPosition;

  @Field(() => Float, { nullable: true })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  scale?: number;

  // TODO: determine the types later
  @Field(() => GraphQLJSON, { nullable: true })
  sources?: any;
}

@InputType()
export class RenderTimelineTrack {
  @Field(() => [RenderTimelineClip])
  clips: RenderTimelineClip[];
}

@InputType()
export class RenderTimelineArgs {
  @Field(() => [RenderTimelineTrack])
  tracks: RenderTimelineTrack[];
}

@InputType()
export class RenderTimelineOutputSize {
  @Field(() => Float)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  width: number;

  @Field(() => Float)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  height: number;
}

@InputType()
export class RenderTimelineOutputArgs {
  @Field(() => RenderTimelineOutputSize)
  size: RenderTimelineOutputSize;
}

@InputType()
export class RenderTimelineDetailsArgs {
  @Field()
  timeline: RenderTimelineArgs;

  @Field(() => RenderTimelineOutputArgs, { nullable: true })
  output?: RenderTimelineOutputArgs;
}

@ArgsType()
export class UpdateClipTimelineArgs {
  @Field(() => RenderTimelineDetailsArgs)
  render: RenderTimelineDetailsArgs;

  @Field(() => String, { description: "clip's uuid" })
  @IsUUID()
  clipId: string;

  @Field(() => String, { description: "video asset uuid" })
  @IsUUID()
  assetId: string;
}
@ArgsType()
export class RenderClipArgs {
  @Field(() => String, { description: "clip's uuid" })
  @IsUUID()
  clipId: string;

  @Field(() => String, { description: "video asset uuid" })
  @IsUUID()
  assetId: string;

  @Field(() => RenderTimelineOutputArgs)
  output: RenderTimelineOutputArgs;
}
