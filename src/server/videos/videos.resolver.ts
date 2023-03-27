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
import { AssetStatus } from "../types/videos.types";
import {
  AbortUploadArgs,
  AdjustClipArgs,
  CompleteUploadArgs,
  ConvertToClipsArgs,
  CreateClipArgs,
  DeleteAssetsArgs,
  GetAssetArgs,
  GetAssetMediasArgs,
  GetAssetsArgs,
  GetClipsArgs,
  GetPartUploadURLArgs,
  StartMediaUploadArgs,
  StartUploadArgs,
  TestConvertToClipsWorkflowStatusArgs,
} from "./videos.args";
import {
  ASSET_UPLOAD_EVENT,
  CONVERT_TO_CLIPS_TOPIC,
  MEDIA_UPLOADED_EVENT,
} from "./videos.constants";
import { VideosService } from "./videos.service";
import {
  Asset,
  AssetUploadResponse,
  AssetUploads,
  Clip,
  ConvertToClipsWorkflowResponse,
  ConvertToClipsWorkflowStatus,
  GetPartUploadResponse,
  Media,
  MuxData,
  StartUploadResponse,
} from "./videos.types";

@Resolver(() => ConvertToClipsWorkflowStatus)
@Service()
export class ConvertToClipsWorkflowStatusResolver {
  constructor(private readonly videosService: VideosService) {}

  @Authorized()
  @FieldResolver(() => Asset, { nullable: true })
  async asset(
    @Root() root: ConvertToClipsWorkflowStatus,
    @Ctx() ctx: GraphQLContext
  ): Promise<Asset | null> {
    try {
      const authInfo: AuthInfo = {
        auth0: ctx?.auth0,
        token: ctx?.token,
      };
      const asset = await this.videosService.getAsset(authInfo, root.assetId);
      return asset;
    } catch (e) {
      console.error(
        "unable to resolve asset field in convertToClipsWorkflow response",
        e
      );
      return null;
    }
  }
}

@Service()
@Resolver(() => Asset)
export class VideosResolver {
  constructor(private readonly videosService: VideosService) {}

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => StartUploadResponse)
  async startMediaUpload(
    @Ctx() ctx: GraphQLContext,
    @Args() args: StartMediaUploadArgs
  ): Promise<StartUploadResponse> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.startMediaUpload(authInfo, args);
  }

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

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => ConvertToClipsWorkflowResponse)
  async convertToClips(
    @Args() args: ConvertToClipsArgs,
    @Ctx() ctx: GraphQLContext
  ): Promise<ConvertToClipsWorkflowResponse> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.convertToClips(authInfo, args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Subscription(() => ConvertToClipsWorkflowStatus, {
    topics: CONVERT_TO_CLIPS_TOPIC,
    filter: ({
      payload,
      context,
    }: {
      payload: ConvertToClipsWorkflowStatus;
      context: GraphQLContext;
    }) => {
      return Number(context.auth0!.organization_id) == payload.org;
    },
  })
  async convertToClipsWorkflowStatus(
    @Root() workflowStatus: ConvertToClipsWorkflowStatus
  ) {
    return workflowStatus;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => Asset)
  async getAsset(
    @Ctx() ctx: GraphQLContext,
    @Args() args: GetAssetArgs
  ): Promise<Asset> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.getAsset(authInfo, args.uuid);
  }

  // TODO: remove once integrated, added for easily testing the workflow
  @Mutation(() => Boolean)
  async testConvertToClipsWorkflowStatus(
    @Args() args: TestConvertToClipsWorkflowStatusArgs
  ): Promise<Boolean> {
    await pubSub.publish(CONVERT_TO_CLIPS_TOPIC, args);
    return true;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Subscription(() => Media, {
    topics: MEDIA_UPLOADED_EVENT,
    filter: ({
      payload,
      context,
    }: {
      payload: Media;
      context: GraphQLContext;
    }) => {
      return Number(context.auth0!.organization_id) == payload.org;
    },
  })
  async mediaUploads(@Root() media: Media): Promise<Media> {
    return media;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => [Media])
  async getAssetMedias(
    @Ctx() ctx: GraphQLContext,
    @Args() args: GetAssetMediasArgs
  ): Promise<Media[]> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };

    return this.videosService.getAssetMedias(authInfo, args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Clip)
  async createClip(
    @Ctx() ctx: GraphQLContext,
    @Args() args: CreateClipArgs
  ): Promise<Clip> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.createClip(authInfo, args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Clip)
  async adjustClip(
    @Ctx() ctx: GraphQLContext,
    @Args() args: AdjustClipArgs
  ): Promise<Clip> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.adjustClip(authInfo, args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => [Clip])
  async getClips(
    @Ctx() ctx: GraphQLContext,
    @Args() args: GetClipsArgs
  ): Promise<Clip[]> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.getClips(authInfo, args);
  }
}
