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
  IShotstackRenderClipResponse,
} from "./shotstack.types";
import { IRenderTimelineDetails } from "../types/render.types";
import { S3Service } from "../videos/s3.service";
import { parseS3URL } from "../videos/utils";

export const OUTPUT_FORMAT = "mp4";
export const CLIP_BACKGROUND = "#000000";
export const ASSET_TYPE_VIDEO = "video";
export const S3_PROVIDER = "s3";
export const S3_ACL = "private";

@Service()
export class ShotstackService {
  private api: AxiosInstance;

  constructor(private readonly s3Service: S3Service) {
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
    render: IRenderTimelineDetails
  ): Promise<IShotstackRenderClipResponse> {
    for (const track of render.timeline.tracks) {
      for (const clip of track.clips) {
        const { bucket, key } = parseS3URL(clip.asset.src);
        const signedURL = await this.s3Service.getObjectSignedURL({
          Bucket: bucket,
          Key: key,
        });
        clip.asset = { ...clip.asset, src: signedURL };
      }
    }

    try {
      const response = await this.api.post(
        `/edit/${config.shotstack.apiEnv}/render`,
        JSON.stringify(render)
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
