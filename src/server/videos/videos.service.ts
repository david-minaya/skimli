import * as Sentry from "@sentry/nextjs";
import {
  AbortMultipartUploadRequest,
  CompleteMultipartUploadRequest,
  GetObjectOutput,
} from "aws-sdk/clients/s3";
import { isNumber } from "class-validator";
import * as path from "path";
import { Service } from "typedi";
import Timecode from "typescript-timecode";
import * as categoriesData from "../../../video-categories.json";
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
  AuthInfo,
  BadInputError,
  InternalGraphQLError,
  MuxError,
} from "../types/base.types";
import {
  AssetStatus,
  ConvertToClipsArgs,
  ConvertToClipsWorkflowResponse,
  ConvertToClipsWorkflowStatus,
  IAdjustClipArgs,
  IClip,
  ICreateClipArgs,
  IGetAssetMediasArgs,
  IGetClipsArgs,
  IMedia,
  IStartMediaUploadArgs,
  MediaStatus,
} from "../types/videos.types";
import { GetMultiPartUploadURLRequest, S3Service } from "./s3.service";
import {
  AbortUploadArgs,
  CompleteUploadArgs,
  GetAssetsArgs,
  GetPartUploadURLArgs as GetPartUploadArgs,
  StartUploadArgs,
} from "./videos.args";
import {
  ASSET_UPLOAD_EVENT,
  CONVERT_TO_CLIPS_TOPIC,
  MAX_CLIP_DURATION_ERROR,
  MAX_CLIP_DURATION_IN_MS,
  MEDIA_UPLOADED_EVENT,
  MIN_CLIP_DURATION_ERROR,
  MIN_CLIP_DURATION_IN_MS,
  SUBTITLE_FILE_EXTENSION,
} from "./videos.constants";
import {
  AssetNotFoundException,
  ClipsNotFoundException,
  SubtitleFileNotSupported,
} from "./videos.exceptions";
import {
  Asset,
  AssetUploads,
  GetPartUploadResponse,
  MuxData,
  StartUploadResponse,
} from "./videos.types";
@Service()
export class VideosService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly s3Service: S3Service,
    private readonly muxService: MuxService,
    private readonly videosAPI: VideosAPI
  ) {}

  async startUpload(
    authInfo: AuthInfo,
    args: StartUploadArgs
  ): Promise<StartUploadResponse> {
    const user = await this.accountsService.getAppUserById(authInfo.auth0.sub);
    const key = `org/${user?.org}/assets/${args.filename}`;

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
      throw new BadInputError("Video already exists in library");
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
      return;
    }

    const asset = await this.muxService.uploadAssetToMux({
      input: [{ url: signedObjectURL }],
      mp4_support: "standard",
      playback_policy: "signed",
      passthrough: `video#${org}#${createdAsset?.uuid}`,
    });
    console.log("mux asset uploaded: ", asset.id);
  }

  async onS3MediaUpload(bucket: string, key: string): Promise<void> {
    const object = await this.s3Service.getObject({
      Bucket: bucket,
      Key: key,
    });
    const metadata: IStartMediaUploadArgs = JSON.parse(
      object.Metadata?.metadata || "null"
    );
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

    const [video] = await this.videosAPI.adminGetAssets({
      org: org,
      uuid: metadata.assetId,
    });
    const media = await this.videosAPI.adminCreateMedia({
      name: filename,
      details: { sourceUrl: `s3://${bucket}/${key}` },
      type: metadata.type,
      assets: { ids: [video.uuid], count: 1 },
      status: MediaStatus.PROCSESSING,
      org: org,
    });

    const track = await this.muxService.createTextTrack(
      video?.sourceMuxAssetId!,
      {
        name: filename,
        url: signedObjectURL,
        language_code: metadata.languageCode!,
        text_type: "subtitles" as const,
        type: "text" as const,
        passthrough: `media#${org}#${media.uuid}`,
      }
    );

    console.log(`track ${track.id} added for mux asset ${metadata.assetId}`);
  }

  async updateAssetInfo(videoId: string, assetId: string): Promise<void> {
    const assetInput = await this.muxService.getAssetInput(assetId);
    const assetInfo = await this.muxService.getMuxAsset(assetId);
    const [_, error] = await this.videosAPI.adminUpdateAsset(videoId, {
      status: AssetStatus.UNCONVERTED,
      sourceMuxAssetId: assetId,
      sourceMuxInputInfo: assetInput,
      sourceMuxAssetData: assetInfo!.asset,
    });
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
  }: {
    org: number;
    event: string;
    passthrough: string;
    payload:
      | MuxAssetReadyEventPayload
      | MuxAssetErredEvent
      | MuxTrackReadyEvent
      | MuxTrackErrorEvent;
  }) {
    if (event == ASSET_READY_EVENT || event == ASSET_ERRED_EVENT) {
      const data = payload as MuxAssetReadyEvent;
      await this.updateAssetInfo(passthrough, data.id);
      const eventPayload: AssetUploads = {
        status:
          data?.status == "ready"
            ? AssetStatus.UNCONVERTED
            : AssetStatus.ERRORED,
        assetId: data.id,
        org: org,
      };
      await pubSub.publish(ASSET_UPLOAD_EVENT, eventPayload);
    } else if (event == TRACK_READY_EVENT || event == TRACK_ERRED_EVENT) {
      const data = payload as MuxTrackReadyEvent;
      const media = await this.videosAPI.adminUpdateMedia(passthrough, {
        status: data?.asset_id ? MediaStatus.READY : MediaStatus.ERRORED,
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
    });
  }

  async getAssets(authInfo: AuthInfo, args: GetAssetsArgs): Promise<Asset[]> {
    const videos = await this.videosAPI.getAssets(args, authInfo.token);
    return videos.map((video) => {
      return {
        ...video,
        status: AssetStatus.NO_CLIPS_FOUND ? AssetStatus.ERRORED : video.status,
      };
    });
    // return videos;
  }

  async getAsset(authInfo: AuthInfo, assetId: string): Promise<Asset> {
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

  async startMediaUpload(
    authInfo: AuthInfo,
    args: IStartMediaUploadArgs
  ): Promise<StartUploadResponse> {
    if (!args.filename.endsWith(SUBTITLE_FILE_EXTENSION)) {
      throw SubtitleFileNotSupported;
    }
    const user = await this.accountsService.getAppUserById(authInfo.auth0.sub);
    const key = `org/${user?.org}/media/${args.assetId}/${args.filename}`;

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
      throw new BadInputError("Media already exists in library");
    }

    try {
      const uploaded = await this.s3Service.startMultiPartUpload({
        Bucket: config.aws.assetsS3Bucket,
        Key: key,
        Metadata: {
          metadata: JSON.stringify(args),
        },
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
    return this.videosAPI.getAssetMedias(args, authInfo.token);
  }

  async validateClip(args: {
    videoAsset: { clips: IClip[]; sourceMuxAssetId: string };
    newOrUpdatedClip: { uuid?: string; startTime: string; endTime: string };
  }) {
    const clip = args.newOrUpdatedClip;
    const clips = args.videoAsset.clips;
    if (clips?.length == 0) throw new BadInputError("Clips not found");

    const duplicateClip = clips.find((c) => {
      if (clip?.uuid && clip.uuid == c.uuid) {
        return false;
      }
      return c.startTime == clip.startTime && c.endTime == clip.endTime;
    });
    if (duplicateClip) {
      throw new BadInputError("Duplicate Clip");
    }

    const duplicateClipWithMatchingStartTime = clips.find((c) => {
      if (clip?.uuid && clip.uuid === c.uuid) {
        return false;
      }
      return c.startTime == clip.startTime;
    });
    if (duplicateClipWithMatchingStartTime)
      throw new BadInputError(`Clip start time must be unique.`);

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
    if (!asset) throw new BadInputError(`Asset not found`);

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
}
