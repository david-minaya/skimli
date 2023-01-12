import axios, { AxiosError, AxiosInstance } from "axios";
import { Service } from "typedi";
import config from "../../config";
import {
  CheckUserExistsParams,
  CheckUserExistsResponse,
  CreateUserRequest,
  CreateUserResponse,
} from "../types/accounts.types";

@Service()
export class UsersAPI {
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: config.api.accountsAPIURL });
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
    accessToken: string
  ): Promise<CreateUserResponse> {
    try {
      const response = await this.api.post("/account/v1/users", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return [response.data, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }
}
