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
  UpdateAssetRequest,
  UpdateAssetResponse,
} from "../types/videos.types";
import { generateAuthHeaders } from "./base.api";

@Service()
export class AssetsAPI {
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.assetsAPIURL,
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

  async getAssets(token: string): Promise<Asset[]> {
    const response = await this.api.get("/video/v1/assets", {
      headers: { ...generateAuthHeaders(token) },
    });
    return response?.data;
  }

  async createAsset(
    body: CreateAssetRequest,
    token: string
  ): Promise<CreateAssetResponse> {
    try {
      const response = await this.api.post("/video/v1/assets", body, {
        headers: {
          ...generateAuthHeaders(token),
        },
      });
      return [response?.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  //   TODO: params
  async updateAsset(
    body: UpdateAssetRequest,
    token: string
  ): Promise<UpdateAssetResponse> {
    try {
      const response = await this.api.put("/video/v1/assets", body, {
        headers: {
          ...generateAuthHeaders(token),
        },
      });
      return [response?.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }
}
