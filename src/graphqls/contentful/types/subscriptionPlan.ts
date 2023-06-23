export interface SubscriptionPlan {
  buttonName: string;
  displayPrice: string;
  mostPopular: boolean;
  planName: string;
  title: string;
  priceDescription: string;
  productCode: string;
  features: {
    description: string;
    list: {
      feature: string;
      toolTip: string;
    }[];
  };
}
