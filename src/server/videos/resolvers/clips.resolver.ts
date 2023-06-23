import { FieldResolver, Root } from "type-graphql";
import { Service } from "typedi";
import { S3Service } from "../s3.service";
import { ClipDetailsRender } from "../videos.types";

// Disable this temporarily ...
// @Resolver(() => ClipDetailsRender)
@Service()
export class ClipDetailsRenderResolver {
  constructor(private s3Service: S3Service) {}

  @FieldResolver(() => String, { nullable: true })
  async downloadUrl(
    @Root() clipDetailsRender: ClipDetailsRender
  ): Promise<string | null> {
    if (!clipDetailsRender || !clipDetailsRender.url) {
      return null;
    }
    const url = new URL(clipDetailsRender.url);
    const signedURL = await this.s3Service.getObjectSignedURL({
      Bucket: url.hostname,
      Key: url.pathname.substring(1),
    });
    return signedURL;
  }
}
