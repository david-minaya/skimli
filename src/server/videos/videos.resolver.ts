import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import { Service } from "typedi";
import pubSub from "../common/pubsub";
import { IsAppUserGuard } from "../middlewares/app-user.guard";
import type { GraphQLContext } from "../schema";
import { AuthInfo } from "../types/base.types";
import {
  AbortUploadArgs,
  CompleteUploadArgs,
  DeleteAssetsArgs,
  GetAssetsArgs,
  GetPartUploadURLArgs,
  StartUploadArgs,
} from "./videos.args";
import { ASSET_UPLOAD_EVENT } from "./videos.constants";
import { VideosService } from "./videos.service";
import {
  Asset,
  AssetStatus,
  AssetUploadResponse,
  AssetUploads,
  GetPartUploadResponse,
  MuxData,
  StartUploadResponse,
} from "./videos.types";

@Service()
@Resolver(() => Asset)
export class VideosResolver {
  constructor(private readonly videosService: VideosService) {}

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => StartUploadResponse)
  async startUpload(
    @Ctx() ctx: GraphQLContext,
    @Args() args: StartUploadArgs
  ): Promise<StartUploadResponse> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.startUpload(authInfo, args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => GetPartUploadResponse)
  async getPartUploadURL(
    @Args() args: GetPartUploadURLArgs
  ): Promise<GetPartUploadResponse> {
    return this.videosService.getPartUploadURL(args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Boolean)
  async completeUpload(@Args() args: CompleteUploadArgs): Promise<Boolean> {
    await this.videosService.completeUpload(args);
    return true;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Boolean)
  async abortUpload(@Args() args: AbortUploadArgs): Promise<Boolean> {
    await this.videosService.abortUpload(args);
    return true;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Subscription(() => AssetUploadResponse, {
    topics: ASSET_UPLOAD_EVENT,
    filter: ({
      payload,
      context,
    }: {
      payload: AssetUploads;
      context: GraphQLContext;
    }) => {
      return Number(context?.auth0?.organization_id) == Number(payload?.org);
    },
  })
  async assetUploads(
    @Root() assetUpload: AssetUploadResponse
  ): Promise<AssetUploadResponse> {
    return assetUpload;
  }

  // TODO: remove after supporting subscriptions on infrastructure
  @Query(() => Boolean)
  async testAssetUpload(@Arg("org") org: number) {
    await pubSub.publish("assetUploads", {
      assetId: Math.floor(Math.random() * 10000).toString(),
      status: AssetStatus.CONVERTING,
      org: org,
    });
    return true;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => [Asset])
  async getAssets(
    @Args() args: GetAssetsArgs,
    @Ctx() ctx: GraphQLContext
  ): Promise<Asset[]> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.getAssets(authInfo, args);
  }

  @FieldResolver(() => MuxData, { nullable: true })
  async mux(@Root() asset: Asset): Promise<MuxData | null> {
    return this.videosService.getMuxDataForAsset(asset.sourceMuxAssetId);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Boolean)
  async deleteAssets(
    @Args() args: DeleteAssetsArgs,
    @Ctx() ctx: GraphQLContext
  ): Promise<boolean> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    await this.videosService.deleteAssets(authInfo, args.assetIds);
    return true;
  }
}
