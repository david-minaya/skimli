import { AxiosError } from "axios";

export enum UserAccountType {
  PERSONAL = "PERSONAL",
  TEAMS = "TEAMS",
}

export enum UserIDPType {
  AUTH0 = "AUTH0",
}

export enum BillingMethodType {
  SUBSCRIPTION = "SUBSCRIPTION",
  CONTRACT = "CONTRACT",
}

export enum PlanIntervalType {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum PaymentProviderType {
  STRIPE = "STRIPE",
}

export interface IUserPaymentMethod {
  uuid: string;
  userId: string;
  // stripe customer id
  providerId?: string;
  provider: PaymentProviderType;
  paymentMethodId: string;
  isPaymentMethod: boolean;
}

export enum UserLimitType {
  MEDIA_GENERATED = "MEDIA_GENERATED",
  LIBRARAY_STORAGE = "LIBRARAY_STORAGE",
  DISTRIBUTION_BANDWIDTH = "DISTRIBUTION_BANDWIDTH",
}

export enum UserLimitUnitType {
  CREDITS = "CREDITS",
  GIGABYTES = "GIGABYTES",
}

export interface IUserLimit {
  uuid?: string;
  userId?: string;
  type: UserLimitType;
  billableMetricCode: string;
  amount: number;
  units: UserLimitUnitType;
}

export interface IUser {
  uuid: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  org: number;
  account: UserAccountType;
  accountOwner: boolean;
  idp: UserIDPType;
  idpUser: string;
  billingMethod: BillingMethodType;
  subscriptionId: string;
  settings: object;
  productCode: string;
  features: object;
  planInterval: PlanIntervalType;
  limits: IUserLimit[];
  isPaid: boolean;
  isOverageAllowed: boolean;
  hasPaymentMethod: boolean;
  paymentMethod?: Partial<IUserPaymentMethod>;
}

export interface CreateUserRequest {
  account: UserAccountType;
  accountOwner: boolean;
  idp: UserIDPType;
  idpUser: string;
  email: string;
}

export interface CheckUserExistsParams {
  email?: string;
  account?: UserAccountType;
  org?: number;
  idpUser?: string;
}

export type CheckUserExistsResponse = [IUser[] | null, AxiosError | null];
export type CreateUserResponse = [IUser | null, AxiosError | null];

export interface UpdateUserRequest extends Partial<IUser> {}

export type UpdateUserResponse = [IUser | null, AxiosError | null];

export type Products = IProduct[];

export enum ProductType {
  CONSUMER_APP = "CONSUMER_APP",
  API = "API",
}

export interface IProductPlanLimit {
  uuid: string;
  plan: IProductPlan;
  planCode: string;
  type: UserLimitType;
  billableMetricCode: string;
  amount: number;
  units: UserLimitUnitType;
}

export interface IProductPlan {
  code: string;
  product: IProduct;
  productCode: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  archivedAt?: string;
  tier: number;
  interval: PlanIntervalType;
  limits: IProductPlanLimit[];
}

export interface IProduct {
  code: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  archivedAt: string;
  type: ProductType;
  eligibleAccount: UserAccountType;
  billingMethod: BillingMethodType;
  isPaid: boolean;
  isOverageAllowed: boolean;
  features: string[];
  plans: IProductPlan[];
}

export interface IAuth0AppMetadata {
  consentGiven: boolean;
  consentTimestamp: string;
  organization_id: number;
  organizationId: number;
  productCode: string;
  planCode: string;
  isPaid: boolean;
  isOverageAllowed: boolean;
  subscriptionId: string;
  features: string[];
}
