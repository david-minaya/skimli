import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Service } from "typedi";
import config from "../../config";
import {
  CreateWalletResponse,
  LagoAPIError,
  LagoAssignPlanToCustomerRequest,
  LagoAssignPlanToCustomerResponse,
  LagoCreateCustomerRequest,
  LagoCreateCustomerResponse,
  LagoCreateWalletRequest,
} from "../types/lago.types";
import {
  axiosRequestErrorLoggerInterceptor,
  axiosRequestLoggerInterceptor,
  axiosResponseErrorLoggerInterceptor,
} from "./base.api";

@Service()
export class LagoAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.lago.lagoAPIURL,
    });

    this.api.interceptors.request.use((request: AxiosRequestConfig) => {
      request.headers!["Content-Type"] = "application/json";
      request.headers!["Authorization"] = `Bearer ${config.lago.lagoAPIKey}`;
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

  async createOrUpdateCustomer(
    data: LagoCreateCustomerRequest
  ): Promise<LagoCreateCustomerResponse> {
    try {
      const response = await this.api.post("/api/v1/customers", {
        customer: data,
      });
      return [response.data?.customer, null];
    } catch (e) {
      console.warn(e);
      return [null, (e as AxiosError)?.response?.data as LagoAPIError];
    }
  }

  async assignPlanToCustomer(
    data: LagoAssignPlanToCustomerRequest
  ): Promise<LagoAssignPlanToCustomerResponse> {
    try {
      const response = await this.api.post("/api/v1/subscriptions", {
        subscription: data,
      });
      return [response.data?.subscription, null];
    } catch (e) {
      console.warn(e);
      return [null, (e as AxiosError)?.response?.data as LagoAPIError];
    }
  }

  async createWallet(
    data: LagoCreateWalletRequest
  ): Promise<CreateWalletResponse> {
    try {
      const response = await this.api.post("/api/v1/wallets", { wallet: data });
      return [response?.data?.wallet, null];
    } catch (e) {
      return [null, (e as AxiosError)?.response?.data as LagoAPIError];
    }
  }
}
