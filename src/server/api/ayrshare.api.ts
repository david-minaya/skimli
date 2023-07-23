/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Service } from "typedi";
import config from "../../config";
import {
  AyrshareCreateProfileRequest,
  AyrshareCreateProfileResponse,
  AyrshareGenerateJwtRequest,
  AyrshareGenerateJwtResponse,
  AyrshareGetUserRequest,
  AyrshareGetUserResponse,
} from "../types/ayrshare.types";
import {
  axiosRequestErrorLoggerInterceptor,
  axiosRequestLoggerInterceptor,
  axiosResponseErrorLoggerInterceptor,
} from "./base.api";

@Service()
export class AyrshareApi {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: config.ayrshare.apiUrl });

    this.api.interceptors.request.use((request: AxiosRequestConfig) => {
      request.headers!["Content-Type"] = "application/json";
      request.headers!["Authorization"] = `Bearer ${config.ayrshare.apiKey}`;
      return request;
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

  async createProfile(
    data: AyrshareCreateProfileRequest
  ): Promise<AyrshareCreateProfileResponse> {
    try {
      const response = await this.api.post("/profiles/profile", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async getUser(
    data: AyrshareGetUserRequest
  ): Promise<AyrshareGetUserResponse> {
    try {
      const response = await this.api.get("/user", {
        headers: {
          "Profile-Key": data.profileKey,
        },
      });
      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  // TODO: This request logs the ayrshare private key. We should try to suppress that.
  async generateJwt(
    data: AyrshareGenerateJwtRequest
  ): Promise<AyrshareGenerateJwtResponse> {
    const body = {
      domain: config.ayrshare.jwtDomain,
      privateKey: config.ayrshare.rsaKey,
      profileKey: data.profileKey,
    };
    try {
      const response = await this.api.post("/profiles/generateJWT", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response?.data;
    } catch (e) {
      throw e;
    }
  }
}
