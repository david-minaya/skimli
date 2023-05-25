import { FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { ImageMediaDetails } from "../videos.types";
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
