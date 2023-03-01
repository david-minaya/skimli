import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import {
  ArgsType,
  createUnionType,
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from "type-graphql";

export interface MuxPlaybackId {
  id: string;
  policy: "public" | "signed";
}

export interface MuxCreateClipResponse {
  created_at: string;
  id: string;
  master_access: string;
  mp4_support: string;
  passthrough: string;
  playback_ids: MuxPlaybackId[];
  source_asset_id: string;
  status: string;
}

export interface MuxAssetReadyEvent {
  status: string;
  source_asset_id: string;
  playback_ids: PlaybackID[];
  passthrough: string;
  mp4_support: string;
  max_stored_resolution: string;
  max_stored_frame_rate: number;
  master_access: string;
  id: string;
  duration: number;
  created_at: number;
  aspect_ratio: string;
}

interface PlaybackID {
  policy: string;
  id: string;
}

export interface MuxAssetErredEvent {
  status: string;
  passthrough: string;
  errors?: {
    type: string;
    messages: string[];
  };
}

export type MuxAssetReadyEventPayload = {
  status: string;
  playbackIds?: Array<{
    policy: string;
    id: string;
  }>;
  assetId?: string;
  passthrough: string;
};

export type TrackStatus = "preparing" | "ready" | "errored";

@ObjectType()
export class VideoTrack {
  @Field()
  id: string;

  @Field(() => String)
  type: "video";

  @Field(() => Float)
  duration: number;

  @Field(() => Int)
  max_width: number;

  @Field(() => Int)
  max_height: number;

  @Field(() => Float)
  max_frame_rate: number;
}

@ObjectType()
export class AudioTrack {
  @Field()
  id: string;

  @Field(() => String)
  type: "audio";

  @Field(() => Float)
  duration: number;

  @Field(() => Int)
  max_channels: number;

  @Field()
  max_channel_layout: string;
}

@ObjectType()
export class TextTrack {
  @Field()
  id: string;

  @Field(() => String)
  type: "text";

  @Field(() => String)
  text_type: "subtitles";

  @Field({ nullable: true })
  language_code?: string;

  @Field({ nullable: true })
  closed_captions?: boolean;
}

export const Track = createUnionType({
  name: "Track",
  types: () => [VideoTrack, AudioTrack, TextTrack],
  resolveType: (value) => {
    if (value.type == "video") {
      return "VideoTrack";
    } else if (value.type == "audio") {
      return "AudioTrack";
    }
    return "TextTrack";
  },
});

@ObjectType()
export class PlaybackId {
  @Field()
  id: string;

  @Field(() => String)
  policy: "public" | "signed";
}

@ObjectType()
export class StaticRendition {
  @Field(() => String)
  name: "low.mp4" | "medium.mp4" | "high.mp4";

  @Field(() => String)
  ext: "mp4";

  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field(() => Float)
  filesize: number;

  @Field(() => Int)
  bitrate: number;
}

@ObjectType()
export class StaticRenditions {
  @Field(() => String)
  status: TrackStatus;

  @Field(() => [StaticRendition], { nullable: true })
  files?: Array<StaticRendition>;
}

export type TrackType = VideoTrack | AudioTrack | TextTrack;

@ObjectType()
export class MuxAsset {
  @Field(() => [Track], { nullable: true })
  tracks?: TrackType[];

  @Field(() => String)
  status: TrackStatus;

  @Field(() => [PlaybackId])
  playback_ids?: PlaybackId[];

  @Field(() => String)
  mp4_support: "none" | "standard";

  @Field(() => String)
  max_stored_resolution?: "Audio only" | "SD" | "HD" | "FHD" | "UHD";

  @Field()
  max_stored_frame_rate?: number;

  @Field(() => String)
  master_access: "none" | "temporary";

  @Field()
  id: string;

  @Field()
  duration?: number;

  @Field()
  created_at: string;

  @Field()
  aspect_ratio?: string;

  @Field(() => StaticRenditions, { nullable: true })
  static_renditions?: StaticRenditions;
}

@ObjectType()
export class MuxTokens {
  @Field(() => String)
  video: string;

  @Field(() => String)
  thumbnail: string;

  @Field(() => String)
  storyboard: string;
}

@ObjectType()
export class MuxSignedAsset {
  @Field(() => MuxAsset, { nullable: true })
  asset?: MuxAsset;

  @Field(() => MuxTokens, { nullable: true })
  tokens?: MuxTokens;
}

export interface IGetMuxThumbnailArgs {
  time?: number; // float
  height?: number; // int32
  width?: number; // int32
  rotate?: number; // 90, 180 and 270
  fit_mode?: ImageFitMode;
  flip_v?: boolean;
  flip_h?: boolean;
}

enum ImageFitMode {
  preserve = "preserve",
  stretch = "stretch",
  crop = "crop",
  smartcrop = "smartcrop",
  pad = "pad",
}

registerEnumType(ImageFitMode, {
  name: "ImageFitMode",
});

@ArgsType()
export class GetMuxThumbnailArgs implements IGetMuxThumbnailArgs {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  playbackId: string;

  @Field(() => Float, { nullable: true })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  time?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  height?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  width?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  rotate?: number;

  @Field(() => ImageFitMode, {
    nullable: true,
  })
  @IsOptional()
  fit_mode?: ImageFitMode;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  flip_v?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  flip_h?: boolean;
}
