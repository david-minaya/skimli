import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { GraphQLError } from "graphql";
import { Service } from "typedi";
import config from "../../config";
import { APIError } from "../types/base.types";
import {
  IAdminGetAssetsArgs,
  Asset,
  ConvertToClipsArgs,
  ConvertToClipsWorkflowResponse,
  CreateAssetRequest,
  CreateAssetResponse,
  DeleteAssetArgs,
  GetAssetsArgs,
  UpdateAssetRequest,
  UpdateAssetResponse,
  ICreateMediaArgs,
  IMedia,
  IGetAssetMediasArgs,
  ICreateClipArgs,
  IClip,
  IGetClipsArgs,
  ICreateSubAssetArgs as IAdminCreateSubAssetArgs,
  ISubAsset,
  IUpdateSubAssetArgs,
  AdminGetSubAssetsQuery,
  IAdminGetMediaArgs,
  IUnlinkMediaArgs,
  ILinkMediasToAssetArgs,
  IAdjustClipArgs,
  IUpdateClipArgs,
} from "../types/videos.types";
import {
  axiosRequestErrorLoggerInterceptor,
  axiosRequestLoggerInterceptor,
  axiosResponseErrorLoggerInterceptor,
  generateAuthHeaders,
  getAppServicesM2MToken,
  isAdminURL,
} from "./base.api";

let APP_SERVICES_M2M_TOKEN = "";

const quotaExceeded = "quota has been used";
@Service()
export class VideosAPI {
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.videosAPIURL,
      headers: {
        ContentType: "application/json",
      },
    });

    this.api.interceptors.request.use((request: AxiosRequestConfig) => {
      request.headers!["Content-Type"] = "application/json";
      if (isAdminURL(request.url!)) {
        request.headers!["Authorization"] = `Bearer ${APP_SERVICES_M2M_TOKEN}`;
      }
      return request;
    });

    this.api.interceptors.request.use(
      (request: AxiosRequestConfig) => axiosRequestLoggerInterceptor(request),
      (error) => axiosRequestErrorLoggerInterceptor(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const config = error.config!;
        if (
          isAdminURL(error.config?.url!) &&
          error.response &&
          error.response.status === 401
        ) {
          APP_SERVICES_M2M_TOKEN = await getAppServicesM2MToken();
          return this.api(config);
        }
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => axiosResponseErrorLoggerInterceptor(error)
    );
  }

  async getAssets(params: GetAssetsArgs, token: string): Promise<Asset[]> {
    try {
      const response = await this.api.get(`/video/v1/assets`, {
        headers: { ...generateAuthHeaders(token) },
        params: params,
      });
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminCreateAsset(
    body: CreateAssetRequest,
    org: number
  ): Promise<CreateAssetResponse> {
    try {
      const response = await this.api.post(`/video/v1/admin/assets`, body, {
        params: { org: org },
      });
      return [response?.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  async adminUpdateAsset(
    videoUUID: string,
    body: UpdateAssetRequest
  ): Promise<UpdateAssetResponse> {
    try {
      const response = await this.api.put(
        `/video/v1/admin/assets/${encodeURIComponent(videoUUID)}`,
        body
      );
      return [response?.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  async deleteAssets(args: DeleteAssetArgs): Promise<void> {
    try {
      // returns string[] for later referece
      await this.api.post(
        "/video/v1/workflows",
        {
          name: "DEL_ASSET" as const,
          assetsId: args.assetIds,
          userId: args.userId,
        },
        { headers: { ...generateAuthHeaders(args.token) } }
      );
    } catch (e) {
      throw new APIError(e);
    }
  }

  async convertToClips(
    args: ConvertToClipsArgs,
    token: string
  ): Promise<ConvertToClipsWorkflowResponse> {
    try {
      const response = await this.api.post(
        "/video/v1/workflows",
        {
          name: "CONVERT_TO_CLIPS" as const,
          assetsId: [args.assetId],
          userId: args.userId,
          category: args.category,
          model: args.model,
        },
        { headers: { ...generateAuthHeaders(token) } }
      );
      return response?.data[0];
    } catch (e) {
      const error = e as AxiosError;
      if (
        error?.response?.data &&
        (error?.response?.data as any)?.message == quotaExceeded
      ) {
        throw new GraphQLError(quotaExceeded, {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      } else throw new APIError(e);
    }
  }

  async adminGetAssets(params: IAdminGetAssetsArgs): Promise<Asset[]> {
    const { org, ...rest } = params;
    try {
      const response = await this.api.get(
        `/video/v1/admin/assets/${encodeURIComponent(org)}`,
        {
          params: rest,
        }
      );
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminCreateMedia(params: ICreateMediaArgs): Promise<IMedia> {
    try {
      const response = await this.api.post("/video/v1/admin/media", params);
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminUpdateMedia(
    mediaId: string,
    params: Partial<ICreateMediaArgs>
  ): Promise<IMedia> {
    try {
      const response = await this.api.put(
        `/video/v1/admin/media/${encodeURIComponent(mediaId)}`,
        params
      );
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async getAssetMedias(
    params: IGetAssetMediasArgs,
    token: string
  ): Promise<IMedia[]> {
    try {
      const response = await this.api.get("/video/v1/media", {
        headers: { ...generateAuthHeaders(token) },
        params: params,
      });
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async createClip(args: ICreateClipArgs, token: string): Promise<IClip> {
    try {
      const response = await this.api.post("/video/v1/clips", args, {
        headers: { ...generateAuthHeaders(token) },
      });
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adjustClip(
    args: Partial<ICreateClipArgs> & { uuid: string },
    token: string
  ): Promise<IClip> {
    try {
      const { uuid, ...rest } = args;
      const response = await this.api.put(
        `/video/v1/clips/${encodeURIComponent(uuid)}`,
        rest,
        {
          headers: { ...generateAuthHeaders(token) },
        }
      );
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async getClips(args: IGetClipsArgs, token: string): Promise<IClip[]> {
    try {
      const response = await this.api.get(`/video/v1/clips`, {
        params: args,
        headers: { ...generateAuthHeaders(token) },
      });
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminCreateSubAsset(
    args: IAdminCreateSubAssetArgs
  ): Promise<ISubAsset> {
    try {
      const response = await this.api.post("/video/v1/admin/subassets", args);
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminGetSubAsset(query: AdminGetSubAssetsQuery): Promise<ISubAsset[]> {
    try {
      const response = await this.api.get(`/video/v1/admin/subassets`, {
        params: { ...query },
      });
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminUpdateSubAsset(
    uuid: string,
    args: IUpdateSubAssetArgs
  ): Promise<ISubAsset> {
    try {
      const response = await this.api.put(
        `/video/v1/admin/subassets/${encodeURIComponent(uuid)}`,
        args
      );
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminGetMedia(args: IAdminGetMediaArgs): Promise<IMedia[]> {
    try {
      const response = await this.api.get("/video/v1/admin/media", {
        params: args,
      });
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminSaveDownloadDetails(
    assetId: string,
    details: object
  ): Promise<void> {
    try {
      const response = await this.api.post(
        `/video/v1/admin/assets/${encodeURIComponent(assetId)}/downloads`,
        { downloads: details }
      );
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async deleteMedia(mediaUUID: string, token: string): Promise<void> {
    try {
      const response = await this.api.delete(
        `/video/v1/media/${encodeURIComponent(mediaUUID)}`,
        { headers: { ...generateAuthHeaders(token) } }
      );
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async unlinkMedia(args: IUnlinkMediaArgs, token: string): Promise<void> {
    const { mediaId, assetIds, count } = args;
    try {
      const response = await this.api.delete(
        `/video/v1/media/${encodeURIComponent(mediaId)}/assets`,
        {
          headers: { ...generateAuthHeaders(token) },
          data: { ids: assetIds, count: count },
        }
      );
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async linkMediasToAsset(
    args: ILinkMediasToAssetArgs,
    token: string
  ): Promise<Asset> {
    const { assetId, mediaIds, count } = args;
    try {
      const response = await this.api.post(
        `/video/v1/assets/${encodeURIComponent(assetId)}/media`,
        { ids: mediaIds, count: count },
        { headers: { ...generateAuthHeaders(token) } }
      );
      return response.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  // clip.uuid
  async resetClip(uuid: string, token: string): Promise<IClip> {
    try {
      const response = await this.api.put(
        `/video/v1/clips/${encodeURIComponent(uuid)}/reset`,
        {},
        { headers: { ...generateAuthHeaders(token) } }
      );
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminUpdateClip(args: IUpdateClipArgs): Promise<IClip> {
    const { uuid, ...params } = args;
    try {
      const response = await this.api.put(
        `/video/v1/admin/clips/${encodeURIComponent(uuid)}`,
        params
      );
      return response.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async updateClip(
    args: Partial<IUpdateClipArgs>,
    token: string
  ): Promise<IClip> {
    try {
      const { uuid, ...rest } = args;
      const response = await this.api.put(
        `/video/v1/clips/${encodeURIComponent(uuid!)}`,
        rest,
        {
          headers: { ...generateAuthHeaders(token) },
        }
      );
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }
}
