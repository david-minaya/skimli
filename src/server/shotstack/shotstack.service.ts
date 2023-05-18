import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Service } from "typedi";
import config from "../../config";
import {
  axiosRequestErrorLoggerInterceptor,
  axiosRequestLoggerInterceptor,
  axiosResponseErrorLoggerInterceptor,
} from "../api/base.api";
import {
  IShotstackIngestAudioArgs,
  IShotstackRenderClipArgs,
  IShotstackRenderClipResponse,
} from "./shotstack.types";
import { v4 } from "uuid";

export const OUTPUT_FORMAT = "mp4";
const CLIP_BACKGROUND = "#000000";
const ASSET_TYPE_VIDEO = "video";
const S3_PROVIDER = "s3";
const S3_ACL = "private";

@Service()
export class ShotstackService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${config.shotstack.apiBaseURL}`,
      headers: {
        "x-api-key": config.shotstack.apikey,
      },
    });

    this.api.interceptors.request.use(
      (request: AxiosRequestConfig) => axiosRequestLoggerInterceptor(request),
      (error) => axiosRequestErrorLoggerInterceptor(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => axiosResponseErrorLoggerInterceptor(error)
    );
  }

  async renderClip(
    args: IShotstackRenderClipArgs
  ): Promise<IShotstackRenderClipResponse> {
    try {
      const response = await this.api.post(
        `/edit/${config.shotstack.apiEnv}/render`,
        JSON.stringify({
          timeline: {
            background: CLIP_BACKGROUND,
            tracks: [
              {
                clips: [
                  {
                    asset: {
                      type: ASSET_TYPE_VIDEO,
                      volume: args.muteAudio ? 0 : 1,
                      trim: args.startTime,
                      src: args.src,
                    },
                    start: 0,
                    length: args.endTime - args.startTime,
                  },
                ],
              },
            ],
          },
          output: {
            size: { width: args.width, height: args.height },
            format: OUTPUT_FORMAT,
            destinations: [
              {
                provider: S3_PROVIDER,
                options: {
                  region: config.aws.awsRegion,
                  bucket: config.aws.assetsS3Bucket,
                  prefix: args.prefix,
                  filename: args.filename,
                  acl: S3_ACL,
                },
              },
            ],
          },
          callback: args.callbackUrl,
        })
      );
      return response.data;
    } catch (e) {
      const error = e as AxiosError;
      console.error(JSON.stringify(error.request));
      console.error(JSON.stringify((e as any)?.request?.data));
      throw e;
    }
  }

  // ingest audio
  async uploadAudio(args: IShotstackIngestAudioArgs): Promise<{ id: string }> {
    try {
      const response = await this.api.post(
        `/ingest/${config.shotstack.apiEnv}/sources`,
        { url: args.url, callback: args.callbackUrl }
      );
      console.log("shotstack upload audio response: ", response?.data);
      return { id: response?.data?.id ?? "" };
    } catch (e) {
      const error = e as AxiosError;
      console.error(JSON.stringify(error.request));
      console.error(JSON.stringify((e as any)?.request?.data));
      throw e;
    }
  }
}
