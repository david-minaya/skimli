import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl as cfGetSignedUrl } from "@aws-sdk/cloudfront-signer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as AWS from "aws-sdk";
import {
  AbortMultipartUploadRequest,
  CompleteMultipartUploadOutput,
  CompleteMultipartUploadRequest,
  CreateMultipartUploadOutput,
  CreateMultipartUploadRequest,
  GetObjectOutput,
  GetObjectRequest,
} from "aws-sdk/clients/s3";
import { addDays } from "date-fns";
import { Readable } from "stream";
import { Service } from "typedi";
import config from "../../config";
import { parseS3URL, streamToString } from "./utils";

AWS.config.update({
  region: config.aws.awsRegion,
});

export interface GetMultiPartUploadURLRequest {
  Bucket: string;
  Key: string;
  PartNumber: number;
  UploadId: string;
}

@Service()
export class S3Service {
  private s3: AWS.S3;
  private s3Client: S3Client;

  constructor() {
    this.s3 = new AWS.S3({
      region: config.aws.awsRegion,
      signatureVersion: "v4",
    });

    this.s3Client = new S3Client({
      region: config.aws.awsRegion,
    });
  }

  async startMultiPartUpload(
    params: CreateMultipartUploadRequest
  ): Promise<CreateMultipartUploadOutput> {
    return this.s3.createMultipartUpload(params).promise();
  }

  async getMultiPartUploadURL(
    params: GetMultiPartUploadURLRequest
  ): Promise<{ url: string }> {
    const signedURL = await this.s3.getSignedUrlPromise("uploadPart", params);
    return { url: signedURL };
  }

  async completeMultiPartUpload(
    params: CompleteMultipartUploadRequest
  ): Promise<CompleteMultipartUploadOutput> {
    return this.s3.completeMultipartUpload(params).promise();
  }

  async abortMultiPartUpload(
    params: AbortMultipartUploadRequest
  ): Promise<void> {
    await this.s3.abortMultipartUpload(params).promise();
    return;
  }

  async getObject(params: GetObjectRequest): Promise<GetObjectOutput> {
    return this.s3
      .headObject({
        Key: params.Key,
        Bucket: params.Bucket,
      })
      .promise();
  }

  async getObjectSignedURL(
    params: GetObjectCommandInput,
    expiresIn = 10000
  ): Promise<string> {
    const command = new GetObjectCommand({ ...params });
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresIn,
    });
    return url;
  }

  async readObjectBody(params: GetObjectCommandInput): Promise<string> {
    const command = new GetObjectCommand({
      ...params,
    });
    const { Body } = await this.s3Client.send(command);
    const bodyContents = await streamToString(Body as Readable);
    return bodyContents;
  }

  async generatedSignedCFURL(s3Url: string): Promise<string> {
    const { key } = parseS3URL(s3Url);

    const url = `${config.aws.awsCFURL}/${key}`;
    const signedUrl = cfGetSignedUrl({
      keyPairId: config.aws.awsCFKeyPairId,
      privateKey: config.aws.awsCFPrivateKey,
      url: url,
      dateLessThan: addDays(new Date(), 3).toString(),
    });
    return signedUrl;
  }
}
