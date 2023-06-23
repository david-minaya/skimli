import { AxiosError } from "axios";

export type UserAccountType = "PERSONAL" | "TEAMS";
export type UserIDPType = "AUTH0";
export type BillingMethodType = "SUBSCRIPTION" | "CONTRACT";

export interface User {
  uuid: string;
  email: string;
  org: number;
  account: UserAccountType;
  accountOwner: boolean;
  idp: UserIDPType;
  idpUser: string;
  product: object;
  entitlements: Entitlements;
  billingMethod: BillingMethodType;
  subscriptionId: string;
  settings: object;
  conversions: number;
  grantedConversions: number;
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

export type CheckUserExistsResponse = [User[] | null, AxiosError | null];
export type CreateUserResponse = [User | null, AxiosError | null];

export interface UpdateUserRequest extends Partial<User> {}

export type UpdateUserResponse = [User | null, AxiosError | null];

export type Products = Product[];

export interface Product {
  code: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  archivedAt: any;
  description: string;
  sku: string;
  type: string;
  eligibleAccount: string;
  billingMethod: string;
  subscriptionPlanCode: string;
  subscriptionPlanDetails: SubscriptionPlanDetails;
  billableMetrics: BillableMetrics;
  entitlements: string[];
}

export interface SubscriptionPlanDetails {
  subscriptionPayInAdvance: boolean;
  subscriptionPlanCurrency: string;
  subscriptionPlanInterval: string;
  subscriptionFreeTrialDays: number;
  subscriptionPlanBaseAmount: number;
}

export interface BillableMetrics {
  "con-app-bet-sub-per-plu-con"?: ConAppBetSubPerPluCon;
  "con-app-bet-sub-per-fre-con"?: ConAppBetSubPerFre;
  "con-app-bet-sub-per-pro-con"?: ConAppBetSubPerProCon;
}

export interface ConAppBetSubPerPluCon {
  charge_model: string;
  charge_amount: string;
  aggregation_type: string;
  event_property_name: string;
}

export interface ConAppBetSubPerFre {
  charge_model: string;
  charge_amount: string;
  aggregation_type: string;
  event_property_name: string;
}

export interface ConAppBetSubPerProCon {
  charge_model: string;
  charge_amount: string;
  aggregation_type: string;
  event_property_name: string;
}

export type Entitlements = Entitlement[];

export interface Entitlement {
  code: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  archivedAt: any;
  description: string;
  details: Details;
}

export interface Details {
  value: string;
  dimension: string;
  valueType: string;
}

export interface IAuth0AppMetadata {
  organization_id: number;
  features?: Record<string, any>;
  consentGiven?: boolean;
  consentTimestamp?: string;
}
