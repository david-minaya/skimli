import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Service } from "typedi";
import config from "../../config";
import {
  axiosRequestErrorLoggerInterceptor,
  axiosRequestLoggerInterceptor,
  axiosResponseErrorLoggerInterceptor,
} from "./base.api";
import { APIError } from "../types/base.types";
import {
  IGetNotificationsArgs,
  INotification,
  IUpdateNotificationArgs,
} from "../types/notifications.types";

@Service()
export class NotificationsAPI {
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.notificationsAPIURL,
      headers: {
        ContentType: "application/json",
      },
    });

    this.api.interceptors.request.use((request: AxiosRequestConfig) => {
      request.headers!["Content-Type"] = "application/json";
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

  async getNotifications(
    args: IGetNotificationsArgs
  ): Promise<INotification[]> {
    try {
      const response = await this.api.get("/notification/v1/notifications", {
        params: args,
      });
      return response.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async updateNotification(
    args: IUpdateNotificationArgs
  ): Promise<INotification> {
    try {
      const { uuid, ...rest } = args;
      const response = await this.api.put(
        `/notification/v1/notifications/${encodeURIComponent(uuid)}`,
        rest
      );
      return response.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async readAllNotifications(org: number): Promise<void> {
    try {
      await this.api.post(
        `/notification/v1/notifications/${encodeURIComponent(org)}/read/all`
      );
    } catch (e) {
      throw new APIError(e);
    }
  }
}
