import { SubscriptionPlan } from './subscriptionPlan';

export interface SubscriptionPlanSection {
  header: string;
  description: string;
  subscriptionPlans: SubscriptionPlan[];
}
