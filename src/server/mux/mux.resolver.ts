import { Args, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { MuxService } from "./mux.service";
import { MuxSignedAsset } from "./mux.types";
import { GetMuxAssetArgs } from "./mux.args";

@Resolver()
@Service()
export class MuxResolver {
  constructor(private readonly muxService: MuxService) {}

  @Query(() => MuxSignedAsset, { nullable: true })
  async getAsset(
    @Args() args: GetMuxAssetArgs
  ): Promise<MuxSignedAsset | null> {
    return this.muxService.getMuxAsset(args.assetId);
  }
}
