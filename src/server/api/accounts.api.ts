import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Service } from "typedi";
import config from "../../config";
import {
  CheckUserExistsParams,
  CheckUserExistsResponse,
  CreateUserRequest,
  CreateUserResponse,
  IUser,
  Products,
  UpdateUserRequest,
  UpdateUserResponse,
} from "../types/accounts.types";
import { APIError } from "../types/base.types";
import {
  axiosRequestErrorLoggerInterceptor,
  axiosRequestLoggerInterceptor,
  axiosResponseErrorLoggerInterceptor,
  generateAuthHeaders,
  getAppServicesM2MToken,
  isAdminURL,
} from "./base.api";

// TODO: refactor admin endpoints to be shared
let APP_SERVICES_M2M_TOKEN = "";

@Service()
export class AccountsAPI {
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.accountsAPIURL,
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

    this.api.interceptors.request.use(
      (request: AxiosRequestConfig) => axiosRequestLoggerInterceptor(request),
      (error) => axiosRequestErrorLoggerInterceptor(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => axiosResponseErrorLoggerInterceptor(error)
    );
  }

  async checkUserExists(
    params: CheckUserExistsParams
  ): Promise<CheckUserExistsResponse> {
    try {
      const response = await this.api.get("/account/v1/users", {
        params: params,
      });
      return [response.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  async createUser(
    body: CreateUserRequest,
    token: string
  ): Promise<CreateUserResponse> {
    try {
      const response = await this.api.post("/account/v1/users", body, {
        headers: { ...generateAuthHeaders(token) },
      });
      return [response.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  async updateUser(
    body: UpdateUserRequest,
    token: string
  ): Promise<UpdateUserResponse> {
    try {
      const response = await this.api.put("/account/v1/users", body, {
        headers: { ...generateAuthHeaders(token) },
      });
      return [response.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  async getProducts(token: string): Promise<Products> {
    try {
      const response = await this.api.get("/account/v1/products", {
        headers: { ...generateAuthHeaders(token) },
      });
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async adminUpdateUser({
    uuid,
    data,
  }: {
    uuid: string;
    data: UpdateUserRequest;
  }): Promise<IUser> {
    try {
      const response = await this.api.put(
        `/account/v1/admin/users/${encodeURIComponent(uuid)}`,
        data
      );
      return response.data;
    } catch (e) {
      throw new APIError(e);
    }
  }
}
