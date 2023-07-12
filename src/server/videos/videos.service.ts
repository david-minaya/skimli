import * as Sentry from "@sentry/nextjs";
import {
  AbortMultipartUploadRequest,
  CompleteMultipartUploadRequest,
  GetObjectOutput,
} from "aws-sdk/clients/s3";
import { isNumber } from "class-validator";
import { GraphQLError } from "graphql";
import * as path from "path";
import { Service } from "typedi";
import Timecode from "typescript-timecode";
import { v4 } from "uuid";
import * as categoriesData from "../../../video-categories.json";
import AppErrorCodes from "../../common/app-error-codes";
import config from "../../config";
import { AccountsService } from "../accounts/accounts.service";
import { VideosAPI } from "../api/videos.api";
import pubSub from "../common/pubsub";
import {
  ASSET_ERRED_EVENT,
  ASSET_READY_EVENT,
  ASSET_UPDATED_EVENT,
  TRACK_ERRED_EVENT,
  TRACK_READY_EVENT,
} from "../mux/mux.constants";
import { MuxService } from "../mux/mux.service";
import {
  MuxAssetErredEvent,
  MuxAssetReadyEvent,
  MuxAssetReadyEventPayload,
  MuxAssetUpdatedEvent,
  MuxSignedAsset,
  MuxTrackErrorEvent,
  MuxTrackReadyEvent,
  VideoTrack,
} from "../mux/mux.types";
import {
  CLIP_BACKGROUND,
  OUTPUT_FORMAT,
  S3_ACL,
  S3_PROVIDER,
  ShotstackService,
} from "../shotstack/shotstack.service";
import {
  IHandleShotstackWebhookArgs,
  ShotstackWebhookType,
} from "../shotstack/shotstack.types";
import {
  AuthInfo,
  BadInputError,
  InternalGraphQLError,
  MuxError,
} from "../types/base.types";
import {
  IRenderTimeline,
  IRenderTimelineDetails,
  ITimelineOutput,
} from "../types/render.types";
import {
  AssetStatus,
  AssetTranscriptionObjectDetectionStatus,
  ConvertToClipsArgs,
  ConvertToClipsWorkflowResponse,
  ConvertToClipsWorkflowStatus,
  IAdjustClipArgs,
  Asset as IAsset,
  IAudioMediaDetails,
  IClip,
  ICreateClipArgs,
  IGetAssetMediasArgs,
  IGetClipsArgs,
  IGetMediaSubtitleArgs,
  IGetObjectDetectionArgs,
  ILinkMediasToAssetArgs,
  IMedia,
  IObjectDetectionResults,
  ISaveDownloadDetails,
  IStartMediaUploadArgs,
  IUnlinkMediaArgs,
  MediaStatus,
  MediaType,
  MuxPassthroughType,
  SubAssetStatus,
  SubAssetType,
  TranscriptionFileStatus,
} from "../types/videos.types";
import { RenderClipArgs, UpdateClipTimelineArgs } from "./args/render.args";
import {
  AbortUploadArgs,
  CompleteUploadArgs,
  GetAssetsArgs,
  GetPartUploadURLArgs as GetPartUploadArgs,
  StartUploadArgs,
} from "./args/videos.args";
import { GetMultiPartUploadURLRequest, S3Service } from "./s3.service";
import { deepCompare, parseS3URL, recursiveRemoveKey } from "./utils";
import {
  ASSET_UPLOAD_EVENT,
  CONVERT_TO_CLIPS_TOPIC,
  DEFAULT_GET_OBJECT_SIGNED_URL_EXPIRATION_SECONDS,
  IGNORE_RENDER_PROPERTIES,
  MAX_CLIP_DURATION_ERROR,
  MAX_CLIP_DURATION_IN_MS,
  MEDIA_UPLOADED_EVENT,
  MIN_CLIP_DURATION_ERROR,
  MIN_CLIP_DURATION_IN_MS,
  RENDER_CLIP_EVENT,
  SUPPORTED_AUDIO_FILE_EXTENSIONS,
  SUPPORTED_IMAGE_FILE_EXTENSIONS,
  SUPPORTED_SUBTITLE_FILE_EXTENSIONS,
  TWLEVE_HOURS_IN_SECONDS,
} from "./videos.constants";
import {
  AssetMediaNotFoundException,
  AssetNotFoundException,
  AudioFileNotSupported,
  AutoTranscriptionFailedException,
  ClipsNotFoundException,
  ImageFileNotSupported,
  MediaLinkedToAssetException,
  MediaNotFoundException,
  MediaNotSubtitleException,
  RenderClipException,
  SubtitleFileNotSupported,
} from "./videos.exceptions";
import {
  AssetUploads,
  GetPartUploadResponse,
  MuxData,
  RenderClipResponse,
  StartUploadResponse,
} from "./videos.types";
import * as _l from "lodash";

@Service()
export class VideosService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly s3Service: S3Service,
    private readonly muxService: MuxService,
    private readonly videosAPI: VideosAPI,
    private readonly shotstackAPI: ShotstackService
  ) {}

  async startUpload(
    authInfo: AuthInfo,
    args: StartUploadArgs
  ): Promise<StartUploadResponse> {
    const key = `org/${authInfo.auth0?.organization_id}/assets/${args.filename}`;
    let asset: GetObjectOutput | null = null;
    try {
      asset = await this.s3Service.getObject({
        Bucket: config.aws.assetsS3Bucket,
        Key: key,
      });
    } catch (e) {
      if ((e as any).code == "NotFound") {
      } else {
        console.error(e);
        throw new InternalGraphQLError(e);
      }
    }

    if (asset) {
      throw new BadInputError(AppErrorCodes.ASSET_ALREADY_EXISTS);
    }

    try {
      const uploaded = await this.s3Service.startMultiPartUpload({
        Bucket: config.aws.assetsS3Bucket,
        Key: key,
      });
      return { key: uploaded.Key!, uploadId: uploaded!.UploadId! };
    } catch (e) {
      console.error(e);
      throw new InternalGraphQLError(e);
    }
  }

  async getPartUploadURL(
    args: GetPartUploadArgs
  ): Promise<GetPartUploadResponse> {
    const params: GetMultiPartUploadURLRequest = {
      Bucket: config.aws.assetsS3Bucket,
      Key: args.key,
      PartNumber: args.partNumber,
      UploadId: args.uploadId,
    };
    try {
      return await this.s3Service.getMultiPartUploadURL(params);
    } catch (e) {
      console.error(e);
      throw new InternalGraphQLError(e);
    }
  }

  async completeUpload(args: CompleteUploadArgs): Promise<void> {
    const params: CompleteMultipartUploadRequest = {
      Bucket: config.aws.assetsS3Bucket,
      Key: args.key,
      UploadId: args.uploadId,
      MultipartUpload: {
        Parts: args.parts,
      },
    };
    try {
      await this.s3Service.completeMultiPartUpload(params);
    } catch (e) {
      console.error(e);
      throw new InternalGraphQLError(e);
    }
  }

  async abortUpload(args: AbortUploadArgs): Promise<void> {
    const params: AbortMultipartUploadRequest = {
      Bucket: config.aws.assetsS3Bucket,
      Key: args.key,
      UploadId: args.uploadId,
    };
    await this.s3Service.abortMultiPartUpload(params);
  }

  getOrgFromKey(key: string): number {
    return Number(key.split("/")[1]);
  }

  getFilenameFromKey(key: string): string {
    return path.parse(key).name;
  }

  async onS3VideoUpload(bucket: string, key: string): Promise<void> {
    const signedObjectURL = await this.s3Service.getObjectSignedURL({
      Bucket: bucket,
      Key: key,
    });
    const org = this.getOrgFromKey(key);

    const filename = this.getFilenameFromKey(key);
    const [createdAsset, error] = await this.videosAPI.adminCreateAsset(
      {
        name: filename,
        sourceUrl: `s3://${bucket}/${key}`,
        status: AssetStatus.PROCESSING,
      },
      org
    );
    if (error) {
      Sentry.captureException(error);
      const payload: AssetUploads = {
        status: AssetStatus.ERRORED,
        org: Number(org),
      };
      await pubSub.publish(ASSET_UPLOAD_EVENT, payload);
      return;
    }

    const asset = await this.muxService.uploadAssetToMux({
      input: [{ url: signedObjectURL }],
      mp4_support: "standard",
      playback_policy: "signed",
      passthrough: `${MuxPassthroughType.VIDEO_ASSET}#${org}#${createdAsset?.uuid}`,
    });
    console.log("mux asset uploaded: ", asset.id);
  }

  async onS3MediaUpload(bucket: string, key: string): Promise<void> {
    const object = await this.s3Service.getObject({
      Bucket: bucket,
      Key: key,
    });

    const decoded = Buffer.from(object.Metadata?.metadata!, "hex").toString();
    const metadata: IStartMediaUploadArgs = JSON.parse(decoded || "null");
    if (!metadata) {
      console.warn(`metadata not found for: ${bucket}/${key}`);
      return;
    }

    const org = this.getOrgFromKey(key);
    const filename = this.getFilenameFromKey(key);
    const signedObjectURL = await this.s3Service.getObjectSignedURL({
      Bucket: bucket,
      Key: key,
    });

    const assetId = metadata?.assetId;
    const assetIds: string[] = [];
    if (assetId) {
      assetIds.push(assetId);
    }
    // assetId / assetIds refers to asset.uuid's
    const sourceUrl = `s3://${bucket}/${key}`;
    const media = await this.videosAPI.adminCreateMedia({
      name: filename,
      details: { sourceUrl: sourceUrl, type: metadata.type },
      type: metadata.type,
      assets: { ids: assetIds, count: assetIds.length },
      status:
        metadata.type == MediaType.IMAGE
          ? MediaStatus.READY
          : MediaStatus.PROCSESSING,
      org: org,
    });

    if (metadata.type == MediaType.SUBTITLE) {
      const [video] = await this.videosAPI.adminGetAssets({
        org: org,
        uuid: metadata?.assetId,
      });
      if (!video) {
        console.warn(`video asset not found for ${metadata?.assetId}`);
        console.warn("skipping creating media");
        return;
      }

      const track = await this.muxService.createTextTrack(
        video?.sourceMuxAssetId!,
        {
          name: filename,
          url: signedObjectURL,
          language_code: metadata.languageCode!,
          text_type: "subtitles" as const,
          type: "text" as const,

          passthrough: `${MuxPassthroughType.SUBTITLE_MEDIA}#${org}#${media.uuid}`,
        }
      );
      console.log(`track ${track.id} added for mux asset ${metadata.assetId}`);
    } else if (metadata.type == MediaType.AUDIO) {
      const muxAudioAsset = await this.muxService.uploadAssetToMux({
        passthrough: `${MuxPassthroughType.AUDIO_MEDIA}#${org}#${media.uuid}`,
        playback_policy: "signed",
        input: [{ url: signedObjectURL, type: "audio", name: filename }],
      });
      console.log(
        `audio mux asset ${muxAudioAsset.id} added for asset ${metadata.assetId}`
      );

      const callbackUrl = new URL(
        `${config.shotstack.callbackURL}/api/webhooks/shostack`
      );
      callbackUrl.searchParams.append("id", media.uuid);
      callbackUrl.searchParams.append("type", ShotstackWebhookType.AUDIO_MEDIA);
      callbackUrl.searchParams.append("org", org?.toString());
      console.log("callback url generated is: ", callbackUrl.toString());

      await this.shotstackAPI.uploadAudio({
        url: signedObjectURL,
        callbackUrl: callbackUrl.toString(),
      });
      console.log("sent audio file to shostack");
    } else if (metadata.type == MediaType.IMAGE) {
      console.log(
        `image asset uploaded and processed for ${JSON.stringify(media)}`
      );
      await pubSub.publish(MEDIA_UPLOADED_EVENT, media);
    }
  }

  async updateAssetInfo(
    videoId: string,
    assetId: string,
    status?: AssetStatus
  ): Promise<void> {
    const assetInput = await this.muxService.getAssetInput(assetId);
    const assetInfo = await this.muxService.getMuxAsset(assetId);

    const payload = {
      sourceMuxAssetId: assetId,
      sourceMuxInputInfo: assetInput,
      sourceMuxAssetData: assetInfo!.asset,
    };

    if (status) {
      payload["status"] = status;
    }

    const [_, error] = await this.videosAPI.adminUpdateAsset(videoId, payload);
    if (error != null) {
      console.error("error", error);
      Sentry.captureException(error);
    }
  }

  async handleMuxEvent({
    event,
    payload,
    org,
    passthrough,
    passthroughType,
  }: {
    org: number;
    event: string;
    passthrough: string;
    passthroughType: string;
    payload:
      | MuxAssetReadyEventPayload
      | MuxAssetErredEvent
      | MuxTrackReadyEvent
      | MuxTrackErrorEvent;
  }) {
    if (event == ASSET_READY_EVENT || event == ASSET_ERRED_EVENT) {
      const data = payload as MuxAssetReadyEvent;

      if (passthroughType == MuxPassthroughType.VIDEO_ASSET) {
        const status =
          data?.status == "ready"
            ? AssetStatus.UNCONVERTED
            : AssetStatus.ERRORED;

        const eventPayload: AssetUploads = {
          status: status,
          assetId: data.id,
          org: org,
        };

        try {
          await this.updateAssetInfo(passthrough, data.id, status);
          await pubSub.publish(ASSET_UPLOAD_EVENT, eventPayload);
        } catch (e) {
          await pubSub.publish(ASSET_UPLOAD_EVENT, {
            ...eventPayload,
            status: AssetStatus.ERRORED,
          });
        }
      } else if (passthroughType == MuxPassthroughType.AUDIO_MEDIA) {
        const [media] = await this.videosAPI.adminGetMedia({
          uuid: passthrough,
          org: org,
        });
        if (!media) {
          console.warn(`media with id: ${passthrough} not found!`);
          return;
        }
        const updatedMedia = await this.videosAPI.adminUpdateMedia(
          passthrough,
          {
            status:
              data?.status == "ready" ? MediaStatus.READY : MediaStatus.ERRORED,
            org: org,
            details: {
              ...media.details,
              muxAssetId: data.id,
              playbackId: data.playback_ids?.pop()?.id,
            },
          }
        );
        await pubSub.publish(MEDIA_UPLOADED_EVENT, updatedMedia);
      }
    } else if (event == TRACK_READY_EVENT || event == TRACK_ERRED_EVENT) {
      const data = payload as MuxTrackReadyEvent;
      const media = await this.videosAPI.adminUpdateMedia(passthrough, {
        status:
          data?.status == "errored" ? MediaStatus.ERRORED : MediaStatus.READY,
        org: org,
      });
      await pubSub.publish(MEDIA_UPLOADED_EVENT, media);
    } else if (event == ASSET_UPDATED_EVENT) {
      const data = payload as MuxAssetUpdatedEvent;
      await this.updateAssetInfo(passthrough, data.id);
    }
  }

  async onMuxWebhookEvent(
    event: string,
    payload:
      | MuxAssetReadyEventPayload
      | MuxTrackReadyEvent
      | MuxAssetErredEvent
      | MuxTrackErrorEvent
  ): Promise<void> {
    if (payload.passthrough.split("#").length < 3) return;

    const [_type, org, passthroughId] = payload.passthrough.split("#");
    if (!_type || !org || !passthroughId) return;
    console.log(
      `received mux webhook ${_type} org: ${org} passthroughId: ${passthroughId}`
    );

    await this.handleMuxEvent({
      event: event,
      passthrough: passthroughId,
      org: Number(org),
      payload: payload,
      passthroughType: _type,
    });
  }

  async getAssets(authInfo: AuthInfo, args: GetAssetsArgs): Promise<IAsset[]> {
    const assets = await this.videosAPI.getAssets(args, authInfo.token);
    return assets;
  }

  async getAsset(authInfo: AuthInfo, assetId: string): Promise<IAsset> {
    const assetsList = await this.videosAPI.getAssets(
      { uuid: assetId },
      authInfo.token
    );
    const asset = assetsList.pop();
    if (!asset) throw AssetNotFoundException;
    return asset;
  }

  async getMuxDataForAsset(assetId: string): Promise<MuxData | null> {
    try {
      const muxData = await this.muxService.getMuxAsset(assetId);
      return muxData;
    } catch (e) {
      return null;
    }
  }

  async deleteAssets(authInfo: AuthInfo, assetIds: string[]): Promise<void> {
    const user = await this.accountsService.getAppUserById(authInfo.auth0.sub);
    await this.videosAPI.deleteAssets({
      assetIds: assetIds,
      userId: user!.uuid,
      token: authInfo.token,
    });
  }

  getModelFromCategory(categoryCode: string): string {
    const category = categoriesData.categories.find(
      (c) => c.code == categoryCode
    );
    return category!.model;
  }

  async convertToClips(
    authInfo: AuthInfo,
    args: ConvertToClipsArgs
  ): Promise<ConvertToClipsWorkflowResponse> {
    const user = await this.accountsService.getAppUserById(authInfo.auth0.sub);
    args.userId = user!.uuid;
    return this.videosAPI.convertToClips(args, authInfo.token);
  }

  async updateConvertToClipsWorkflowStatus(
    workflowStatus: ConvertToClipsWorkflowStatus
  ): Promise<void> {
    await pubSub.publish(CONVERT_TO_CLIPS_TOPIC, workflowStatus);
  }

  checkSupportedMediaFile({
    filename,
    type,
  }: {
    filename: string;
    type: MediaType;
  }) {
    const ext = filename.split(".").pop()?.toLowerCase() as string;

    if (
      type == MediaType.SUBTITLE &&
      !SUPPORTED_SUBTITLE_FILE_EXTENSIONS.includes(ext)
    ) {
      throw SubtitleFileNotSupported;
    } else if (
      type == MediaType.AUDIO &&
      !SUPPORTED_AUDIO_FILE_EXTENSIONS.includes(ext)
    ) {
      throw AudioFileNotSupported;
    } else if (
      type == MediaType.IMAGE &&
      !SUPPORTED_IMAGE_FILE_EXTENSIONS.includes(ext)
    ) {
      throw ImageFileNotSupported;
    }
  }

  async startMediaUpload(
    authInfo: AuthInfo,
    args: IStartMediaUploadArgs
  ): Promise<StartUploadResponse> {
    this.checkSupportedMediaFile({ filename: args.filename, type: args.type });

    let key = "";
    if (args.type == MediaType.SUBTITLE) {
      key = `org/${authInfo.auth0?.organization_id}/media/${args.assetId}/${args.filename}`;
    } else {
      key = `org/${authInfo.auth0?.organization_id}/media/${args.filename}`;
    }

    let asset: GetObjectOutput | null = null;
    try {
      asset = await this.s3Service.getObject({
        Bucket: config.aws.assetsS3Bucket,
        Key: key,
      });
    } catch (e) {
      if ((e as any).code == "NotFound") {
      } else {
        console.error(e);
        throw new InternalGraphQLError(e);
      }
    }

    if (asset) {
      throw new BadInputError(AppErrorCodes.MEDIA_FILE_EXISTS);
    }

    try {
      const uploaded = await this.s3Service.startMultiPartUpload({
        Bucket: config.aws.assetsS3Bucket,
        Key: key,
        Metadata: {
          metadata: Buffer.from(JSON.stringify(args)).toString("hex"),
        },
        // ContentType: "",
      });
      return { key: uploaded.Key!, uploadId: uploaded!.UploadId! };
    } catch (e) {
      console.error(e);
      throw new InternalGraphQLError(e);
    }
  }

  async getAssetMedias(
    authInfo: AuthInfo,
    args: IGetAssetMediasArgs
  ): Promise<IMedia[]> {
    const medias = await this.videosAPI.getAssetMedias(args, authInfo.token);
    return medias;
  }

  async validateClip(args: {
    videoAsset: { clips: IClip[]; sourceMuxAssetId: string };
    newOrUpdatedClip: { uuid?: string; startTime: string; endTime: string };
  }) {
    const clip = args.newOrUpdatedClip;
    const clips = args.videoAsset.clips;
    if (clips?.length == 0) throw ClipsNotFoundException;

    const duplicateClip = clips.find((c) => {
      if (clip?.uuid && clip.uuid == c.uuid) {
        return false;
      }
      return c.startTime == clip.startTime && c.endTime == clip.endTime;
    });
    if (duplicateClip) {
      throw new BadInputError(AppErrorCodes.DUPLICATE_CLIP);
    }

    const duplicateClipWithMatchingStartTime = clips.find((c) => {
      if (clip?.uuid && clip.uuid === c.uuid) {
        return false;
      }
      return c.startTime == clip.startTime;
    });
    if (duplicateClipWithMatchingStartTime)
      throw new BadInputError(AppErrorCodes.DUPLICATE_CLIP_START_TIME);

    let muxAsset: MuxSignedAsset | null;
    try {
      muxAsset = await this.muxService.getMuxAsset(
        args.videoAsset.sourceMuxAssetId
      );
    } catch (e) {
      throw new MuxError(e);
    }
    if (!muxAsset) throw new InternalGraphQLError(`Mux asset not found`);

    const videoTrack = muxAsset.asset?.tracks?.find(
      (track) => track.type == "video"
    ) as VideoTrack;
    if (!videoTrack || !isNumber(videoTrack?.duration)) {
      throw new InternalGraphQLError(`Unable to get video duration`);
    }

    let errors: string[] = [];
    const originalVideoDurationInMS = videoTrack.duration * 1000;
    const startTimeInMS = Timecode.TimetoMilliseconds(clip.startTime);
    const endTimeInMS = Timecode.TimetoMilliseconds(clip.endTime);

    if (startTimeInMS < 0) {
      errors.push("start time cannot be less than 0");
    }

    if (endTimeInMS > originalVideoDurationInMS) {
      errors.push(`end time cannot be more than original video duration`);
    }

    const clipDuration = endTimeInMS - startTimeInMS;
    if (clipDuration < MIN_CLIP_DURATION_IN_MS) {
      errors.push(MIN_CLIP_DURATION_ERROR);
    }

    if (clipDuration > MAX_CLIP_DURATION_IN_MS) {
      errors.push(MAX_CLIP_DURATION_ERROR);
    }

    if (errors.length > 0) {
      throw new BadInputError(`Invalid clip times`, errors);
    }
  }

  async createClip(authInfo: AuthInfo, args: ICreateClipArgs): Promise<IClip> {
    const asset = await this.getAsset(authInfo, args.assetId);
    if (!asset) throw AssetNotFoundException;

    const clips = asset.inferenceData?.human.clips || [];
    await this.validateClip({
      videoAsset: { clips, sourceMuxAssetId: asset.sourceMuxAssetId! },
      newOrUpdatedClip: args,
    });
    const clip = await this.videosAPI.createClip(args, authInfo.token);
    return clip;
  }

  async adjustClip(authInfo: AuthInfo, args: IAdjustClipArgs): Promise<IClip> {
    const asset = await this.getAsset(authInfo, args.assetId);
    if (!asset) throw AssetNotFoundException;

    const clips = asset.inferenceData?.human.clips || [];
    await this.validateClip({
      videoAsset: { clips: clips, sourceMuxAssetId: asset.sourceMuxAssetId! },
      newOrUpdatedClip: args,
    });
    const clip = await this.videosAPI.adjustClip(args, authInfo.token);
    return clip;
  }

  async getClips(authInfo: AuthInfo, args: IGetClipsArgs): Promise<IClip[]> {
    let clips = await this.videosAPI.getClips(args, authInfo.token);
    if (!clips) throw ClipsNotFoundException;
    clips = clips.map((c) => {
      return {
        ...c,
        caption: c.caption != null ? c.caption : `No caption detected`,
      };
    });
    return clips;
  }

  async getSubtitleMedia(
    authInfo: AuthInfo,
    args?: IGetMediaSubtitleArgs
  ): Promise<string> {
    let url: URL;

    if (args?.mediaId) {
      const medias = await this.videosAPI.getAssetMedias(
        { uuid: args.mediaId },
        authInfo.token
      );
      const media = medias?.pop();
      if (!media) {
        throw AssetMediaNotFoundException;
      }

      if (media.type != MediaType.SUBTITLE) {
        throw MediaNotSubtitleException;
      }
      url = new URL(media.details.sourceUrl);
    } else {
      const asset = await this.getAsset(authInfo, args?.assetId!);
      if (
        asset.metadata?.transcription?.status !=
          AssetTranscriptionObjectDetectionStatus.COMPLETED ||
        asset?.metadata?.transcription?.transcriptionFileStatus !=
          TranscriptionFileStatus.VALID ||
        !asset?.metadata?.transcription?.sourceUrl
      ) {
        throw AutoTranscriptionFailedException;
      }
      url = new URL(asset.metadata?.transcription?.sourceUrl);
    }

    try {
      const { bucket, key } = parseS3URL(url.toString());
      const vttString = await this.s3Service.readObjectBody({
        Bucket: bucket,
        Key: key,
      });
      return vttString;
    } catch (e) {
      console.error(`unable to read vtt file for media ${args}`, e);
      throw new InternalGraphQLError(`Failed to read subtitle`);
    }
  }

  async generateSignedURL({
    s3URL,
    isAttachment = false,
    expiresIn = DEFAULT_GET_OBJECT_SIGNED_URL_EXPIRATION_SECONDS,
  }: {
    s3URL: string;
    isAttachment: boolean;
    expiresIn?: number;
  }): Promise<string> {
    const { bucket, key } = parseS3URL(s3URL);
    const signedAssetURL = await this.s3Service.getObjectSignedURL(
      {
        Bucket: bucket,
        Key: key,
        ResponseContentDisposition: isAttachment ? "attachment" : "inline",
      },
      expiresIn
    );
    return signedAssetURL;
  }

  generateRenderOutput({
    width,
    height,
    prefix,
    filename,
  }: {
    width: number;
    height: number;
    prefix: string;
    filename: string;
  }): ITimelineOutput {
    return {
      size: { width: width, height: height },
      format: OUTPUT_FORMAT,
      destinations: [
        {
          provider: S3_PROVIDER,
          options: {
            region: config.aws.awsRegion,
            bucket: config.aws.assetsS3Bucket,
            prefix: prefix,
            filename: filename,
            acl: S3_ACL,
          },
        },
      ],
    };
  }

  async renderClip(
    authInfo: AuthInfo,
    args: RenderClipArgs
  ): Promise<null | string> {
    const org = Number(authInfo.auth0.organization_id);
    const asset = await this.getAsset(authInfo, args.assetId);
    let clip = asset.inferenceData?.human.clips?.find(
      (c) => c.uuid == args.clipId
    );
    if (!clip) {
      throw ClipsNotFoundException;
    }

    if (!clip.details?.currentTimeline && !clip.details?.renderedTimeline) {
      throw new BadInputError(`No saved timeline`);
    }

    if (clip.details.currentTimeline?.output?.size) {
      const { width: currentWidth, height: currentHeight } =
        clip.details.currentTimeline?.output?.size;
      if (
        currentWidth != args.output.size.width ||
        currentHeight != args.output.size.height
      ) {
        clip = await this.videosAPI.updateClip(
          {
            uuid: clip.uuid,
            details: {
              ...clip.details,
              currentTimeline: {
                ...clip.details.currentTimeline!,
                output: {
                  ...clip.details.currentTimeline?.output!,
                  size: {
                    width: args.output.size.width,
                    height: args.output.size.height,
                  },
                },
              },
            },
          },
          authInfo.token
        );
      }
    }

    // check if render json is same or not, if same return download link else do a new render
    const isRendered = deepCompare({
      object: clip.details?.currentTimeline,
      other: clip.details?.renderedTimeline,
      ignore: IGNORE_RENDER_PROPERTIES,
    });

    if (isRendered) {
      const renderedClip = clip.details?.renders.pop();
      if (!renderedClip)
        throw new InternalGraphQLError(`Rendered Clip Not Found`);

      const downloadUrl = await this.generateSubAssetDownloadLink({
        assetId: asset.uuid,
        clipId: clip.uuid,
        downloadedAt: new Date().toUTCString(),
        render: renderedClip,
      });
      return downloadUrl;
    }

    const subAssetID = v4();
    const prefix = `org/${org}/clips/${args.clipId}/renders`;
    const filename = v4();

    const { width, height } = args.output.size;
    const renderOutput = this.generateRenderOutput({
      width: width!,
      prefix: prefix,
      height: height!,
      filename: filename,
    });

    const callbackUrl = new URL(
      `${config.shotstack.callbackURL}/api/webhooks/shostack`
    );
    callbackUrl.searchParams.append("id", subAssetID);
    callbackUrl.searchParams.append("type", ShotstackWebhookType.SUB_ASSET);
    callbackUrl.searchParams.append("org", org?.toString());

    const previousTimeline = clip.details?.currentTimeline?.timeline;
    const timeline: IRenderTimeline = {
      ...previousTimeline,
      background: CLIP_BACKGROUND,
      tracks: [...(previousTimeline?.tracks ?? [])],
    };
    const renderJSON: IRenderTimelineDetails = {
      timeline: timeline,
      output: renderOutput,
      callback: callbackUrl.toString(),
    };

    // TODO: determine the sources, make it better later
    recursiveRemoveKey(renderJSON, "sources");
    const renderClipResponse = await this.shotstackAPI.renderClip(renderJSON);
    console.log("render clip response: ", JSON.stringify(renderClipResponse));

    await this.videosAPI.adminUpdateClip({
      uuid: clip.uuid,
      details: {
        ...clip.details,
        currentTimeline: renderJSON,
        renderedTimeline: renderJSON,
      },
    });

    const subAsset = await this.videosAPI.adminCreateSubAsset({
      uuid: subAssetID,
      clipId: args.clipId,
      parentId: args.assetId,
      type: SubAssetType.CLIP,
      details: {
        clipId: args.clipId,
        timeline: renderJSON,
        response: renderClipResponse,
      },
      org: org,
      status: SubAssetStatus.PROCESSING,
      render: {
        url: `s3://${config.aws.assetsS3Bucket}/${prefix}/${filename}.${OUTPUT_FORMAT}`,
      },
    });

    const payload: RenderClipResponse = {
      parentId: subAsset.parentId,
      clipId: subAsset.details.clipId,
      status: subAsset.status,
      org: org,
    };
    await pubSub.publish(RENDER_CLIP_EVENT, payload);
    return null;
  }

  async handleShotstackSubAssetReady(
    args: IHandleShotstackWebhookArgs
  ): Promise<void> {
    const subAsset = (
      await this.videosAPI.adminGetSubAsset({ uuid: args.id })
    ).pop();
    if (!subAsset) {
      console.warn("subasset not found with id: ", args.id);
      return;
    }

    if (subAsset.details?.renderId) {
      console.log(
        "duplicate webhook request hence ignoring ...",
        JSON.stringify(args)
      );
      return;
    }

    if (args.body.error) {
      const updatedSubAsset = await this.videosAPI.adminUpdateSubAsset(
        args.id,
        {
          type: subAsset.type,
          details: {
            ...subAsset.details,
            renderId: args.body?.render,
            response: args.body,
          },
          status: SubAssetStatus.FAILED,
        }
      );
      const payload: RenderClipResponse = {
        parentId: subAsset.parentId,
        clipId: subAsset?.details.clipId,
        status: updatedSubAsset.status,
        org: subAsset.org,
      };
      await pubSub.publish(RENDER_CLIP_EVENT, payload);
    } else {
      const updatedSubAsset = await this.videosAPI.adminUpdateSubAsset(
        args.id,
        {
          type: subAsset.type,
          details: { ...subAsset.details, renderId: args.body?.render },
          status: SubAssetStatus.SUCCESS,
        }
      );

      const downloadUrl = await this.generateSubAssetDownloadLink({
        assetId: subAsset.parentId,
        clipId: subAsset.details.clipId,
        downloadedAt: new Date().toUTCString(),
        render: subAsset.render,
        subAssetId: subAsset.uuid,
      });
      const payload: RenderClipResponse = {
        parentId: subAsset.parentId,
        clipId: subAsset?.details.clipId,
        status: updatedSubAsset.status,
        org: subAsset.org,
        downloadUrl: downloadUrl,
      };
      await pubSub.publish(RENDER_CLIP_EVENT, payload);
    }
  }

  async generateSubAssetDownloadLink(
    args: ISaveDownloadDetails
  ): Promise<string> {
    await this.videosAPI.adminSaveDownloadDetails(args.assetId, args);
    if (!args?.render?.url) {
      throw RenderClipException;
    }
    return this.generateSignedURL({
      s3URL: args.render.url,
      isAttachment: true,
    });
  }

  async handleShotstackAudioMediaReady(
    args: IHandleShotstackWebhookArgs
  ): Promise<void> {
    const [media] = await this.videosAPI.adminGetMedia({
      uuid: args.id,
      org: Number(args.org),
    });
    if (!media) {
      console.warn("media not found with id: ", args.id);
      return;
    }

    const mediaDetails = media.details as IAudioMediaDetails;
    if (mediaDetails.shotstack?.render) {
      console.log(
        "duplicate webhook request hence ignoring ...",
        JSON.stringify(args)
      );
      return;
    }

    const updatedMedia = await this.videosAPI.adminUpdateMedia(args.id, {
      org: args.org,
      details: {
        ...media.details,
        shotstack: {
          ...(media.details as IAudioMediaDetails)?.shotstack,
          id: args.body?.id ?? "",
          url: args.body?.url ?? "",
          status: args.body.error ? "error" : "ready",
          render: args.body?.render ?? "",
        },
      },
    });
    await pubSub.publish(MEDIA_UPLOADED_EVENT, updatedMedia);
    return;
  }

  async handleShotstackWebhook(
    args: IHandleShotstackWebhookArgs
  ): Promise<void> {
    if (!["serve", "edit"].includes(args.body.type)) {
      console.warn("shotstack bad webhook request body", args.body);
      return;
    }

    if (args.body.type != "serve") {
      return;
    }

    if (args.type == ShotstackWebhookType.SUB_ASSET) {
      return this.handleShotstackSubAssetReady(args);
    } else if (args.type == ShotstackWebhookType.AUDIO_MEDIA) {
      return this.handleShotstackAudioMediaReady(args);
    } else {
      console.warn("shostack webhook type not found: ", args.type);
    }

    return;
  }

  async getObjectDetectionLabels(
    authInfo: AuthInfo,
    args: IGetObjectDetectionArgs
  ) {
    const asset = await this.getAsset(authInfo, args.assetId);
    if (!asset) throw AssetNotFoundException;

    if (
      !asset?.metadata?.objectDetection ||
      asset?.metadata?.objectDetection?.status !=
        AssetTranscriptionObjectDetectionStatus.COMPLETED
    ) {
      throw new GraphQLError(`object detection data not available`);
    }

    try {
      const { bucket, key } = parseS3URL(
        asset?.metadata?.objectDetection?.sourceUrl!
      );
      const objectDetection: IObjectDetectionResults = JSON.parse(
        await this.s3Service.readObjectBody({
          Bucket: bucket,
          Key: key,
        })
      );
      if (!args?.withBoundingBoxes) {
        return objectDetection;
      }
      const objectDetectionWithBoundingBoxes = objectDetection.filter(
        (label) => label?.Label?.Instances?.length > 0
      );

      return objectDetectionWithBoundingBoxes;
    } catch (e) {
      throw new InternalGraphQLError(`failed to parse object detection data`);
    }
  }

  async deleteMedia(authInfo: AuthInfo, mediaId: string): Promise<boolean> {
    const [media] = await this.videosAPI.getAssetMedias(
      { uuid: mediaId },
      authInfo.token
    );
    if (!media) {
      throw MediaNotFoundException;
    }

    if (Number(media.assets?.ids?.length) > 0) {
      throw MediaLinkedToAssetException;
    }

    await this.videosAPI.deleteMedia(mediaId, authInfo.token);
    return true;
  }

  async unlinkMedia(
    authInfo: AuthInfo,
    args: IUnlinkMediaArgs
  ): Promise<boolean> {
    args.count = args.assetIds.length;
    await this.videosAPI.unlinkMedia(args, authInfo.token);
    return true;
  }

  async linkMediasToAsset(
    authInfo: AuthInfo,
    args: ILinkMediasToAssetArgs
  ): Promise<IAsset> {
    args.count = args.mediaIds.length;
    return this.videosAPI.linkMediasToAsset(args, authInfo.token);
  }

  async resetClip(clipId: string, authInfo: AuthInfo): Promise<IClip> {
    return this.videosAPI.resetClip(clipId, authInfo.token);
  }

  async getMediaSourceUrl(
    mediaId: string,
    authInfo: AuthInfo
  ): Promise<string> {
    const [media] = await this.videosAPI.getAssetMedias(
      { uuid: mediaId },
      authInfo.token
    );
    if (!media) {
      throw MediaNotFoundException;
    }

    return this.generateSignedURL({
      isAttachment: false,
      s3URL: media.details?.sourceUrl,
      expiresIn: TWLEVE_HOURS_IN_SECONDS,
    });
  }

  async getAssetSourceUrl(
    assetId: string,
    authInfo: AuthInfo
  ): Promise<string> {
    const [asset] = await this.videosAPI.getAssets(
      { uuid: assetId },
      authInfo.token
    );
    if (!asset) {
      throw AssetNotFoundException;
    }

    return this.generateSignedURL({
      isAttachment: false,
      s3URL: asset.sourceUrl,
      expiresIn: TWLEVE_HOURS_IN_SECONDS,
    });
  }

  async updateClipTimeline(args: UpdateClipTimelineArgs, authInfo: AuthInfo) {
    const asset = await this.getAsset(authInfo, args.assetId);
    const clip = asset.inferenceData?.human.clips?.find(
      (c) => c.uuid == args.clipId
    );
    if (!clip) {
      throw ClipsNotFoundException;
    }

    // generate a full render based on stored render
    const timeline: IRenderTimelineDetails = {
      ...args.render,
      timeline: {
        ...args.render.timeline,
        background:
          clip.details?.currentTimeline?.timeline?.background ??
          CLIP_BACKGROUND,
      },
      output: clip.details?.currentTimeline?.output,
      callback: clip.details?.currentTimeline?.callback ?? "",
    };

    const updatedClip = await this.videosAPI.updateClip(
      {
        uuid: clip.uuid,
        details: { ...clip.details, currentTimeline: timeline },
      },
      authInfo.token
    );
    return updatedClip;
  }
}
