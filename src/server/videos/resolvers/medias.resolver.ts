import { FieldResolver, Resolver, Root } from "type-graphql";
import { AudioMediaDetails, ImageMediaDetails } from "../videos.types";
import { MuxService, MuxTokenType } from "../../mux/mux.service";
import { Service } from "typedi";
import { S3Service } from "../s3.service";

@Resolver(() => ImageMediaDetails)
@Service()
export class ImageMediaDetailsResolver {
  constructor(private s3Service: S3Service) {}

  @FieldResolver(() => String)
  async cdnUrl(@Root() root: ImageMediaDetails): Promise<string> {
    const url = this.s3Service.generatedSignedCFURL(root.sourceUrl);
    return url;
  }
}

@Resolver(() => AudioMediaDetails)
@Service()
export class AudioMediaDetailsResolver {
  constructor(private muxService: MuxService) {}

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
}
