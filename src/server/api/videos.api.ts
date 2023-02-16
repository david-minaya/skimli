import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Service } from "typedi";
import config from "../../config";
import { APIError } from "../types/base.types";
import {
  Asset,
  CreateAssetRequest,
  CreateAssetResponse,
  GetAssetsArgs,
  UpdateAssetRequest,
  UpdateAssetResponse,
} from "../types/videos.types";
import {
  generateAuthHeaders,
  getAppServicesM2MToken,
  isAdminURL,
} from "./base.api";

let APP_SERVICES_M2M_TOKEN = "";

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
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response?.status >= 400) {
          console.log("response status", response?.statusText);
          console.log("response body", response?.data);
        }
        return response;
      },
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
        Promise.reject(error);
      }
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
      console.error("unable to get assets", e);
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
        `/video/v1/admin/assets/${videoUUID}`,
        body
      );
      return [response?.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  async deleteAssets(assetIds: string[], token: string): Promise<void> {
    try {
      // returns string[] for later referece
      await this.api.post(
        "/video/v1/workflows",
        { name: "DEL_ASSET" as const, assetsId: assetIds },
        { headers: { ...generateAuthHeaders(token) } }
      );
    } catch (e) {
      throw new APIError(e);
    }
  }
}
