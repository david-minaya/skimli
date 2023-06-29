export interface Account {
  account: string;
  accountOwner: boolean;
  billingMethod: string;
  email: string;
  idp: string;
  idpUser: string;
  org: number;
  productCode: string;
  settings: any;
  subscriptionId: string;
  features: string[];
  planInterval: string;
  isPaid: boolean;
  isOverageAllowed: boolean;
  hasPaymentMethod: boolean;
  paymentMethod: PaymentMethod;
}

export interface PaymentMethod {
  providerId: string;
  provider: string;
  paymentMethodId: string;
  isPaymentMethod: boolean;
}
