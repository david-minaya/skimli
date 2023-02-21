import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import config from "../../config";
import { APIError } from "../types/base.types";
import * as AxiosLogger from "axios-logger";

export function generateAuthHeaders(token: string): { Authorization: string } {
  return { Authorization: token };
}

export function isAdminURL(url: string): boolean {
  return url.includes("/admin/");
}

export async function getAppServicesM2MToken(): Promise<string> {
  try {
    const response = await axios.post(
      `https://${config.auth0.auth0ManagementAPIDomain}/oauth/token`,
      {
        client_id: config.auth0.auth0AppServicesClientId,
        client_secret: config.auth0.auth0AppServicesClientSecret,
        audience: config.auth0.auth0AppServicesAudience,
        grant_type: "client_credentials" as const,
      }
    );
    return response?.data?.access_token;
  } catch (e) {
    console.error("unable to get app-services m2m token", e);
    throw new APIError(e);
  }
}

const dateFormat = "isoDateTime";

export function axiosRequestLoggerInterceptor(request: AxiosRequestConfig) {
  return AxiosLogger.requestLogger(request, {
    dateFormat: dateFormat,
    params: true,
    url: true,
    method: true,
  });
}

export function axiosRequestErrorLoggerInterceptor(error: any) {
  return AxiosLogger.errorLogger(error, {
    dateFormat: dateFormat,
    status: true,
    statusText: true,
    data: true,
    params: true,
  });
}

export function axiosResponseLoggerInterceptor(
  response: AxiosResponse
): AxiosResponse<any, any> {
  return AxiosLogger.responseLogger(response, {
    dateFormat: dateFormat,
    data: response?.status >= 400,
    statusText: true,
    status: true,
    params: true,
  });
}

export function axiosResponseErrorLoggerInterceptor(
  error: AxiosError<unknown, any>
): Promise<AxiosError<any, any>> {
  return AxiosLogger.errorLogger(error, {
    dateFormat: dateFormat,
    data: true,
    statusText: true,
    status: true,
    params: true,
  });
}
