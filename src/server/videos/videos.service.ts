import * as Sentry from "@sentry/nextjs";
import {
  AbortMultipartUploadRequest,
  CompleteMultipartUploadRequest,
  GetObjectOutput,
} from "aws-sdk/clients/s3";
import { GraphQLError } from "graphql";
import * as path from "path";
import { Service } from "typedi";
import config from "../../config";
import { AccountsService } from "../accounts/accounts.service";
import { VideosAPI } from "../api/videos.api";
import pubSub from "../common/pubsub";
import { MuxService } from "../mux/mux.service";
import { MuxAssetReadyEventPayload } from "../mux/mux.types";
import { AuthInfo, InternalGraphQLError } from "../types/base.types";
import { GetMultiPartUploadURLRequest, S3Service } from "./s3.service";
import {
  AbortUploadArgs,
  CompleteUploadArgs,
  GetAssetsArgs,
  GetPartUploadURLArgs as GetPartUploadArgs,
  StartUploadArgs,
} from "./videos.args";
import { ASSET_UPLOAD_EVENT } from "./videos.constants";
import {
  Asset,
  AssetStatus,
  AssetUploads,
  GetPartUploadResponse,
  StartUploadResponse,
} from "./videos.types";
import { IsUUID, isUUID } from "class-validator";

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
      throw new GraphQLError("Video already exists in library");
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

  async handleS3AssetUploadEvent(bucket: string, key: string): Promise<void> {
    const signedObjectURL = await this.s3Service.getObjectSignedURL({
      Bucket: bucket,
      Key: key,
    });
    const org = this.getOrgFromKey(key);

    const filename = this.getFilenameFromKey(key);
    const [createdAsset, error] = await this.videosAPI.createAsset(
      {
        name: filename,
        sourceUrl: `s3://${bucket}/${key}`,
        status: AssetStatus.PROCESSING,
      },
      org
    );
    if (error != null) {
      Sentry.captureException(error);
      console.error("unable to create asset in assets api", error);
      return;
    }

    const asset = await this.muxService.uploadAssetToMux({
      input: [{ url: signedObjectURL }],
      mp4_support: "standard",
      playback_policy: "signed",
      passthrough: `${org}#${createdAsset?.uuid}`,
    });
    console.log("mux asset uploaded: ", asset.id);
  }

  async handleMuxAssetReadyEvent(
    event: MuxAssetReadyEventPayload
  ): Promise<void> {
    const [org, videoAssetId] = event.passthrough.split("#");
    console.log(
      `received mux webhook org: ${org} and videoId: ${videoAssetId}`
    );
    const organizationId = Number(org);

    // TODO: remove in next PR
    if (!isUUID(videoAssetId, "4")) return;

    const assetInput = await this.muxService.getAssetInput(event.assetId!);
    const assetInfo = await this.muxService.getMuxAsset(event.assetId!);
    const [_, error] = await this.videosAPI.updateAsset(
      videoAssetId,
      {
        status: AssetStatus.UNCONVERTED,
        sourceMuxAssetId: event?.assetId,
        sourceMuxInputInfo: assetInput,
        sourceMuxAssetData: assetInfo!.asset,
      },
      organizationId
    );
    if (error != null) {
      console.error(error);
      Sentry.captureException(error);
    }

    if (event?.assetId) {
      const payload: AssetUploads = {
        status: AssetStatus.CONVERTING,
        assetId: event.assetId,
        org: organizationId,
      };
      await pubSub.publish(ASSET_UPLOAD_EVENT, payload);
    } else {
      await pubSub.publish(ASSET_UPLOAD_EVENT, {
        status: AssetStatus.ERRORED,
        org: organizationId,
      });
    }
  }

  async getAssets(authInfo: AuthInfo, args: GetAssetsArgs): Promise<Asset[]> {
    const org = Number(authInfo.auth0.organization_id);
    const assets = await this.videosAPI.getAssets(args, org, authInfo.token);
    return assets;
  }

  async deleteAssets(authInfo: AuthInfo, assetIds: string[]): Promise<void> {
    await this.videosAPI.deleteAssets(assetIds, authInfo.token);
    return;
  }
}
