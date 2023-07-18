import { FieldResolver, Resolver, Root } from "type-graphql";
import {
  AudioMediaDetails,
  ImageMediaDetails,
  SubtitleMediaDetails,
} from "../videos.types";
import { MuxService, MuxTokenType } from "../../mux/mux.service";
import { Service } from "typedi";
import { S3Service } from "../s3.service";
import { VideosService } from "../videos.service";
import { TWLEVE_HOURS_IN_SECONDS } from "../videos.constants";

@Resolver(() => ImageMediaDetails)
@Service()
export class ImageMediaDetailsResolver {
  constructor(
    private s3Service: S3Service,
    private readonly videosService: VideosService
  ) {}

  @FieldResolver(() => String)
  async cdnUrl(@Root() root: ImageMediaDetails): Promise<string> {
    const url = this.s3Service.generatedSignedCFURL(root.sourceUrl);
    return url;
  }

  @FieldResolver(() => String)
  async publicUrl(@Root() root: ImageMediaDetails): Promise<string> {
    if (!root.sourceUrl) {
      return "";
    }
    return this.videosService.generateSignedURL({
      isAttachment: false,
      s3URL: root.sourceUrl,
      expiresIn: TWLEVE_HOURS_IN_SECONDS,
    });
  }
}

@Resolver(() => AudioMediaDetails)
@Service()
export class AudioMediaDetailsResolver {
  constructor(
    private muxService: MuxService,
    private readonly videosService: VideosService
  ) {}

  @FieldResolver(() => String, { nullable: true })
  async muxToken(@Root() root: AudioMediaDetails) {
    if (!root.muxAssetId || !root.playbackId) {
      return null;
    }
    return this.muxService.generateToken(
      root.playbackId!,
      MuxTokenType.TOKEN_TYPE_VIDEO
    );
  }

  @FieldResolver(() => String)
  async publicUrl(@Root() root: ImageMediaDetails): Promise<string> {
    if (!root.sourceUrl) {
      return "";
    }
    return this.videosService.generateSignedURL({
      isAttachment: false,
      s3URL: root.sourceUrl,
      expiresIn: TWLEVE_HOURS_IN_SECONDS,
    });
  }
}

@Resolver(() => SubtitleMediaDetails)
@Service()
export class SubtitleMediaDetailsResolver {
  constructor(private readonly videosService: VideosService) {}

  @FieldResolver(() => String)
  async publicUrl(@Root() root: SubtitleMediaDetails): Promise<string> {
    if (!root.sourceUrl) {
      return "";
    }
    return this.videosService.generateSignedURL({
      isAttachment: false,
      s3URL: root.sourceUrl,
      expiresIn: TWLEVE_HOURS_IN_SECONDS,
    });
  }
}
