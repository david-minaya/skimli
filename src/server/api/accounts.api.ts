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
  CheckAyrshareProfileParams,
  CheckAyrshareProfileResponse,
  CheckUserIntegrationParams,
  CheckUserIntegrationResponse,
  CheckUserIntegrationsAvailableParams,
  CheckUserIntegrationsCurrentParams,
  CheckUserIntegrationsUpgradesParams,
  CheckUserIntegrationsUpgradesResponse,
  CreateAyrshareProfileParams,
  CreateAyrshareProfileResponse,
  IAddNewIntegrationParams,
  IAyrshareProfile,
  IDeleteIntegrationParams,
  IUserIntegration,
  IntegrationCategoryType,
  IntegrationCodeType,
} from "../types/integrations.types";
import { AyrshareApi } from "./ayrshare.api";
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

  constructor(private readonly ayrshareApi: AyrshareApi) {
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

  async checkUserIntegrationsUpgrades(
    token: string,
    params: CheckUserIntegrationsUpgradesParams
  ): Promise<CheckUserIntegrationsUpgradesResponse> {
    try {
      const response = await this.api.get("/account/v1/integrations/upgrades", {
        headers: { ...generateAuthHeaders(token) },
        params: params,
      });
      if (response.data) {
        const upgrades: IUserIntegration[] = response.data.map((item) => ({
          code: item.code as IntegrationCodeType,
          category: item.category as IntegrationCategoryType,
        }));
        return upgrades;
      } else {
        return null;
      }
    } catch (e) {
      throw new APIError(e);
    }
  }

  async getAvailableIntegrations(
    params: CheckUserIntegrationsAvailableParams,
    token: string
  ): Promise<IUserIntegration[]> {
    try {
      const response = await this.api.get(
        "/account/v1/integrations/available",
        {
          headers: { ...generateAuthHeaders(token) },
          params: params,
        }
      );
      if (!response.data) return [];
      const available: IUserIntegration[] = response.data.map((item) => ({
        code: item.code as IntegrationCodeType,
        category: item.category as IntegrationCategoryType,
      }));
      return available;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async getCurrentUserIntegrations(
    params: CheckUserIntegrationsCurrentParams,
    token: string
  ): Promise<IUserIntegration[]> {
    try {
      const response = await this.api.get("/account/v1/integrations/current", {
        headers: { ...generateAuthHeaders(token) },
        params: params,
      });
      if (!response.data) {
        return [];
      }
      const current: IUserIntegration[] = response.data.map((item) => ({
        code: item.code as IntegrationCodeType,
        category: item.category as IntegrationCategoryType,
      }));
      return current;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async checkUserIntegration(
    token: string,
    params: CheckUserIntegrationParams
  ): Promise<CheckUserIntegrationResponse> {
    try {
      const response = await this.api.get(
        "/account/v1/integrations/userIntegration",
        {
          headers: { ...generateAuthHeaders(token) },
          params: params,
        }
      );
      if (!response.data) {
        return null;
      }
      /*const userIntegration: IUserIntegration = response.data.map((item) => ({
        code: item.code as IntegrationCodeType,
        category: item.category as IntegrationCategoryType,
      }));*/
      const userIntegration: IUserIntegration = {
        code: response.data.code as IntegrationCodeType,
        category: response.data.category as IntegrationCategoryType,
      };
      return userIntegration;
    } catch (e) {
      throw e;
    }
  }

  async checkAyrshareProfile(
    params: CheckAyrshareProfileParams,
    token: string
  ): Promise<CheckAyrshareProfileResponse> {
    try {
      const response = await this.api.get(
        "/account/v1/integrations/ayrshareProfile",
        {
          headers: { ...generateAuthHeaders(token) },
          params: params,
        }
      );
      const ayrshareProfile: IAyrshareProfile = {
        title: response.data.title as string,
        profileKey: response.data.profileKey as string,
        refId: response.data.refId as string,
      };
      return ayrshareProfile;
    } catch (e) {
      throw e;
    }
  }

  async createAyrshareProfile(
    token: string,
    body: CreateAyrshareProfileParams
  ): Promise<CreateAyrshareProfileResponse> {
    try {
      const response = await this.api.post(
        "/account/v1/integrations/ayrshareProfile",
        body,
        { headers: { ...generateAuthHeaders(token) } }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addNewIntegration(params: IAddNewIntegrationParams, token: string) {
    try {
      const response = await this.api.post(
        "/account/v1/integrations/userIntegration",
        { idpUser: params.idpUser, integrationCode: params.integrationCode },
        { headers: { ...generateAuthHeaders(token) } }
      );
      return response.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async deleteIntegration(
    params: IDeleteIntegrationParams,
    token: string
  ): Promise<void> {
    const encodedIdpUser = encodeURIComponent(params.idpUser);
    const encodedIntegrationCode = encodeURIComponent(params.integrationCode);
    try {
      await this.api.delete(
        `/account/v1/integrations/userIntegration/${encodedIdpUser}/${encodedIntegrationCode}`,
        { headers: { ...generateAuthHeaders(token) } }
      );
    } catch (e) {
      throw new APIError(e);
    }
  }
}
