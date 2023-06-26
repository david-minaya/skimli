import { GraphQLError } from "graphql";
import {
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
import conversionsMapping from "../../../../aspect-ration-conversions.json";
import { IsAppUserGuard } from "../../middlewares/app-user.guard";
import type { GraphQLContext } from "../../schema";
import { AuthInfo } from "../../types/base.types";
import { RenderClipArgs, UpdateClipTimelineArgs } from "../args/render.args";
import {
  AbortUploadArgs,
  AdjustClipArgs,
  CompleteUploadArgs,
  ConvertToClipsArgs,
  CreateClipArgs,
  DeleteAssetsArgs,
  DeleteMediaArgs,
  GetAssetArgs,
  GetAssetMediasArgs,
  GetAssetSourceUrlArgs,
  GetAssetsArgs,
  GetClipsArgs,
  GetMediaSourceUrlArgs,
  GetObjectDetectionLabelsArgs,
  GetPartUploadURLArgs,
  GetSubtitleMediaArgs,
  GetSupportedConversionsArgs,
  LinkMediasToAssetArgs,
  ResetClipArgs,
  StartMediaUploadArgs,
  StartUploadArgs,
  UnlinkMediaArgs,
} from "../args/videos.args";
import { getAspectRatio } from "../video-utils";
import {
  ASSET_UPLOAD_EVENT,
  CONVERT_TO_CLIPS_TOPIC,
  MEDIA_UPLOADED_EVENT,
  RENDER_CLIP_EVENT,
  TWLEVE_HOURS_IN_SECONDS,
} from "../videos.constants";
import { GetSubtitleMediaException } from "../videos.exceptions";
import { VideosService } from "../videos.service";
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
  ObjectDetectionResult,
  RenderClipResponse,
  StartUploadResponse,
} from "../videos.types";

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
    if (!asset?.sourceMuxAssetId) return null;
    return this.videosService.getMuxDataForAsset(asset?.sourceMuxAssetId);
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
    const model = this.videosService.getModelFromCategory(args.category);
    return this.videosService.convertToClips(authInfo, { ...args, model });
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

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => String, { nullable: true })
  async getSubtitleMedia(
    @Ctx() ctx: GraphQLContext,
    @Args() args: GetSubtitleMediaArgs
  ): Promise<string> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    if (!args?.assetId && !args.mediaId) {
      throw GetSubtitleMediaException;
    }

    return this.videosService.getSubtitleMedia(authInfo, args);
  }

  @FieldResolver(() => String, { nullable: true })
  async aspectRatio(@Root() asset: Asset): Promise<string | null> {
    if (!asset.sourceMuxInputInfo || asset?.sourceMuxInputInfo?.length < 0) {
      return null;
    }

    const videoTrack = asset.sourceMuxInputInfo[0].file.tracks.find(
      (track) => track.type == "video"
    );
    const width = videoTrack?.width!;
    const height = videoTrack?.height!;
    if (!width || !height) {
      return null;
    }
    return getAspectRatio(width, height);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => [String])
  async getSupportedConversions(
    @Args() args: GetSupportedConversionsArgs
  ): Promise<string[]> {
    const supportedConversions = conversionsMapping.find(
      (conversion) => conversion.sourceAspectRatio == args.sourceAspectRatio
    );
    return supportedConversions?.conversionOptions || [];
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => String, {
    nullable: true,
    description:
      "if a clip with given quality and muteAudio is already rendered then download url (string) is returned else null value is returned indicating the clip is sent for rendering",
  })
  async renderClip(
    @Ctx() ctx: GraphQLContext,
    @Args() args: RenderClipArgs
  ): Promise<string | null> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    try {
      const response = await this.videosService.renderClip(authInfo, args);
      return response;
    } catch (e) {
      console.error(e);
      throw new GraphQLError(`Unable to render clip`);
    }
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Subscription(() => RenderClipResponse, {
    topics: RENDER_CLIP_EVENT,
    filter: ({
      payload,
      context,
    }: {
      payload: RenderClipResponse;
      context: GraphQLContext;
    }) => {
      return Number(context?.auth0?.organization_id) == Number(payload?.org);
    },
  })
  async renderClipStatus(
    @Root() response: RenderClipResponse
  ): Promise<RenderClipResponse> {
    return response;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => [ObjectDetectionResult], { nullable: true })
  async getObjectDetectionLabels(
    @Args() args: GetObjectDetectionLabelsArgs,
    @Ctx() ctx: GraphQLContext
  ): Promise<ObjectDetectionResult[]> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    const objectDetectionLabels =
      await this.videosService.getObjectDetectionLabels(authInfo, args);
    return objectDetectionLabels;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Boolean)
  async deleteMedia(
    @Args() args: DeleteMediaArgs,
    @Ctx() ctx: GraphQLContext
  ): Promise<boolean> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.deleteMedia(authInfo, args.mediaId);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Boolean)
  async unlinkMedia(@Args() args: UnlinkMediaArgs, @Ctx() ctx: GraphQLContext) {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.unlinkMedia(authInfo, args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Asset)
  async linkMediasToAsset(
    @Ctx() ctx: GraphQLContext,
    @Args() args: LinkMediasToAssetArgs
  ): Promise<Asset> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.linkMediasToAsset(authInfo, args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Clip)
  async resetClip(@Ctx() ctx: GraphQLContext, @Args() args: ResetClipArgs) {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.resetClip(args.clipId, authInfo);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => String)
  async getMediaSourceUrl(
    @Ctx() ctx: GraphQLContext,
    @Args() args: GetMediaSourceUrlArgs
  ) {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.getMediaSourceUrl(args.mediaId, authInfo);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => String)
  async getAssetSourceUrl(
    @Ctx() ctx: GraphQLContext,
    @Args() args: GetAssetSourceUrlArgs
  ) {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.getAssetSourceUrl(args.assetId, authInfo);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Clip)
  async updateClipTimeline(
    @Ctx() ctx: GraphQLContext,
    @Args() args: UpdateClipTimelineArgs
  ): Promise<Clip> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.videosService.updateClipTimeline(args, authInfo);
  }

  @FieldResolver(() => String)
  async publicUrl(@Root() asset: Asset): Promise<string> {
    if (!asset.sourceUrl) return "";
    return this.videosService.generateSignedURL({
      isAttachment: false,
      s3URL: asset.sourceUrl,
      expiresIn: TWLEVE_HOURS_IN_SECONDS,
    });
  }
}
