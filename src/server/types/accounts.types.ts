import { AxiosError } from "axios";

export type UserAccountType = "PERSONAL" | "TEAMS";
export type UserIDPType = "AUTH0";
export type BillingMethodType = "SUBSCRIPTION" | "CONTRACT";

export interface User {
  org: number;
  account: UserAccountType;
  accountOwner: boolean;
  idp: UserIDPType;
  idpUser: string;
  email: string;
  product: object;
  entitlements: object;
  billingMethod: BillingMethodType;
  subscriptionId: string;
  settings: object;
}

export interface CreateUserRequest {
  account: UserAccountType;
  accountOwner: boolean;
  idp: UserIDPType;
  idpUser: string;
  email: string;
}

export interface CheckUserExistsParams {
  email: string;
  account: UserAccountType;
}

export type CheckUserExistsResponse = [User[] | null, AxiosError | null];
export type CreateUserResponse = [User | null, AxiosError | null];
