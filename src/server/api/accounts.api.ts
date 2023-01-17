import axios, { AxiosError, AxiosInstance } from "axios";
import { Service } from "typedi";
import config from "../../config";
import {
  CheckUserExistsParams,
  CheckUserExistsResponse,
  CreateUserRequest,
  CreateUserResponse,
  Entitlements,
  Products,
  UpdateUserRequest,
  UpdateUserResponse,
} from "../types/accounts.types";
import { APIError } from "../types/base.types";

function generateAuthHeaders(token: string): { Authorization: string } {
  return { Authorization: token };
}

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
        headers: generateAuthHeaders(token),
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
        headers: generateAuthHeaders(token),
      });
      return [response.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  async getProducts(token: string): Promise<Products> {
    try {
      const response = await this.api.get("/account/v1/products", {
        headers: generateAuthHeaders(token),
      });
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  async getEntitlements(token: string): Promise<Entitlements> {
    try {
      const response = await this.api.get("/account/v1/entitlements", {
        headers: generateAuthHeaders(token),
      });
      return response?.data;
    } catch (e) {
      throw new APIError(e);
    }
  }
}