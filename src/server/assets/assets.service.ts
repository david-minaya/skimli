import {
  AbortMultipartUploadRequest,
  CompleteMultipartUploadRequest,
  GetObjectOutput,
} from "aws-sdk/clients/s3";
import { GraphQLError } from "graphql";
import { Service } from "typedi";
import config from "../../config";
import { AccountsService } from "../accounts/accounts.service";
import pubSub from "../common/pubsub";
import { MuxService } from "../mux/mux.service";
import { MuxAssetReadyEventPayload } from "../mux/mux.types";
import { AuthInfo, InternalGraphQLError } from "../types/base.types";
import {
  AbortUploadArgs,
  CompleteUploadArgs,
  GetPartUploadURLArgs as GetPartUploadArgs,
  StartUploadArgs,
} from "./assets.args";
import { ASSET_UPLOAD_EVENT } from "./assets.constants";
import {
  AssetStatus,
  AssetUploads,
  GetPartUploadResponse,
  StartUploadResponse,
} from "./assets.types";
import { GetMultiPartUploadURLRequest, S3Service } from "./s3.service";

@Service()
export class AssetsService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly s3Service: S3Service,
    private readonly muxService: MuxService
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

  getOrgFromKey(key: string): string {
    const org = key.split("/")[1];
    return org;
  }

  async handleS3AssetUploadEvent(bucket: string, key: string): Promise<void> {
    const signedObjectURL = await this.s3Service.getObjectSignedURL({
      Bucket: bucket,
      Key: key,
    });
    const org = this.getOrgFromKey(key);
    const asset = await this.muxService.uploadAssetToMux({
      input: [{ url: signedObjectURL }],
      mp4_support: "standard",
      playback_policy: "signed",
      passthrough: `${org}#${bucket}/${key}`,
    });
    console.log("mux asset uploaded: ", asset.id);
  }

  async handleMuxAssetReadyEvent(
    event: MuxAssetReadyEventPayload
  ): Promise<void> {
    const org = event.passthrough.split("#")[0];
    if (event?.assetId) {
      const payload: AssetUploads = {
        status: AssetStatus.CONVERTING,
        assetId: event.assetId,
        org: org,
      };
      await pubSub.publish(ASSET_UPLOAD_EVENT, payload);
    } else {
      await pubSub.publish(ASSET_UPLOAD_EVENT, {
        status: AssetStatus.ERRORED,
        org: org,
      });
    }
  }
}
