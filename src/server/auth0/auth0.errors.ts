import { GraphQLError } from "graphql";

export const EmailAlreadyVerifiedError = new GraphQLError(
  `Email is already verified`
);
