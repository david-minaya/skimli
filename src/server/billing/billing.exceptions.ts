import AppErrorCodes from "../../common/app-error-codes";
import { BadInputError, InternalGraphQLError } from "../types/base.types";

export const ProductNotFoundException = new BadInputError(
  AppErrorCodes.PRODUCT_NOT_FOUND
);

export const PlanNotFoundException = new BadInputError(
  AppErrorCodes.PLAN_NOT_FOUND
);

export const UserNotEligilbeForProductException = new BadInputError(
  AppErrorCodes.USER_NOT_ELIGIBLE_FOR_PRODUCT
);

export const PlanSubscriptionFailedException = new InternalGraphQLError(
  AppErrorCodes.PLAN_SUBSCRIPTION_FAILED
);

export const SubscriptionAlreadyActiveException = new BadInputError(
  AppErrorCodes.SUBSCRIPTION_ALREADY_ACTIVE
);

export const PaymentFailedException = new BadInputError(
  AppErrorCodes.PAYMENT_FAILED
);

export const PaymentPendingException = new BadInputError(
  AppErrorCodes.PAYMENT_FAILED
);
