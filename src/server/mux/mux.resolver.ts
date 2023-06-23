import { Arg, Args, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { MuxService } from "./mux.service";
import { GetMuxThumbnailArgs, MuxSignedAsset } from "./mux.types";
import { GetMuxAssetArgs } from "./mux.args";

@Resolver()
@Service()
export class MuxResolver {
  constructor(private readonly muxService: MuxService) {}

  @Query(() => MuxSignedAsset, { nullable: true })
  async getMuxAsset(
    @Args() args: GetMuxAssetArgs
  ): Promise<MuxSignedAsset | null> {
    return this.muxService.getMuxAsset(args.assetId);
  }

  @Query(() => String)
  async getThumbnail(@Args() args: GetMuxThumbnailArgs): Promise<string> {
    const { playbackId, ...params } = args;
    return this.muxService.getThumbnail(playbackId, params);
  }
}
