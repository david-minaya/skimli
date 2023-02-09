import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Service } from "typedi";
import config from "../../config";
import {
  Asset,
  CreateAssetRequest,
  CreateAssetResponse,
  GetAssetsArgs,
  UpdateAssetRequest,
  UpdateAssetResponse,
} from "../types/videos.types";
import { generateAuthHeaders } from "./base.api";
import { APIError } from "../types/base.types";

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
      return request;
    });
    this.api.interceptors.response.use((response: AxiosResponse) => {
      if (response?.status >= 400) {
        console.log("response status", response?.statusText);
        console.log("response body", response?.data);
      }
      return response;
    });
  }

  async getAssets(
    params: GetAssetsArgs,
    org: number,
    token: string
  ): Promise<Asset[]> {
    try {
      const response = await this.api.get(
        `/video/v1/organizations/${org}/assets`,
        {
          headers: { ...generateAuthHeaders(token) },
          params: params,
        }
      );
      return response?.data;
    } catch (e) {
      console.error(e);
      throw new APIError(e);
    }
  }

  async createAsset(
    body: CreateAssetRequest,
    org: number
  ): Promise<CreateAssetResponse> {
    try {
      const response = await this.api.post(
        `/video/v1/organizations/${org}/assets`,
        body
      );
      return [response?.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  async updateAsset(
    videoUUID: string,
    body: UpdateAssetRequest,
    org: number
  ): Promise<UpdateAssetResponse> {
    try {
      const response = await this.api.put(
        `/video/v1/organizations/${org}/assets/${videoUUID}`,
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
