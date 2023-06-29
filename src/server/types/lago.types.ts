export interface LagoCustomer {
  lago_id: string;
  sequential_id: string;
  slug: string;
  external_id: string;
  address_line1?: string;
  address_line2?: any;
  city?: string;
  country?: string;
  created_at?: string;
  email?: string;
  legal_name?: string;
  legal_number?: string;
  logo_url?: string;
  name?: string;
  phone?: string;
  state?: string;
  url?: string;
  zipcode?: string;
  currency?: string;
  billing_configuration?: LagoBillingConfiguration;
}

export interface LagoBillingConfiguration {
  payment_provider?: "stripe";
  // stripe customer id
  provider_customer_id?: string;
  vat_rate?: number;
  // to auto create stripe customer id
  sync_with_provider?: boolean;
  sync?: boolean;
}

export interface LagoCreateCustomerRequest extends Partial<LagoCustomer> {
  external_id: string;
  name: string;
}

export type LagoCreateCustomerResponse = [
  LagoCustomer | null,
  LagoAPIError | null
];

export interface LagoAPIError {
  status: number;
  error: "Bad Request" | "Unauthorized" | "Unprocessable entity";
  code?: string;
  error_details?: Record<string, string[]>;
}

export interface LagoSubscription {
  lago_id: string;
  lago_customer_id: string;
  external_customer_id: string;
  canceled_at?: string;
  created_at: string;
  plan_code: string;
  started_at: string;
  status: string;
  name?: string;
  external_id: string;
  billing_time: string;
  subscription_date: string;
  terminated_at?: string;
  previous_plan_code?: string;
  next_plan_code?: string;
  downgrade_plan_date?: string;
}

export interface LagoAssignPlanToCustomerRequest {
  external_customer_id: string;
  plan_code: string;
  external_id: string;
  name?: string;
  subscription_date?: string;
  billing_time?: "calendar" | "anniversary";
}

export type LagoAssignPlanToCustomerResponse = [
  LagoSubscription | null,
  LagoAPIError | null
];

export interface LagoWallet {
  lago_id: string;
  lago_customer_id: string;
  external_customer_id: string;
  status: "active" | "terminated";
  currency: string;
  name?: string;
  rate_amount: string;
  credits_balance: string;
  balance: string;
  consumed_credits: string;
  created_at: string;
  last_balance_sync_at?: string;
  last_consumed_credit_at?: string;
  terminated_at?: string;
}

export interface ILagoGetInvoicesParams {
  external_customer_id: string;
  per_page?: number;
  page?: number;
  status?: LagoInvoiceStatus;
  payment_status?: LagoInvoicePaymentStatus;
}

export enum LagoInvoicePaymentStatus {
  pending = "pending",
  succeeded = "succeeded",
  failed = "failed",
}

export enum LagoInvoiceStatus {
  draft = "draft",
  finalized = "finalized",
}

export interface LagoInvoice {
  lago_id: string;
  sequential_id: number;
  number: string;
  issuing_date: Date;
  invoice_type: string;
  status: LagoInvoiceStatus;
  payment_status: LagoInvoicePaymentStatus;
  currency: string;
  fees_amount_cents: number;
  vat_amount_cents: number;
  coupons_amount_cents: number;
  credit_notes_amount_cents: number;
  sub_total_vat_excluded_amount_cents: number;
  sub_total_vat_included_amount_cents: number;
  total_amount_cents: number;
  file_url: string;
  legacy: boolean;
  customer: LagoCustomer;
  subscriptions: LagoSubscription[];
}
