import { GraphQLError } from "graphql";

export const EmailAlreadyVerifiedError = new GraphQLError(
  `Email is already verified`
);

export const PasswordManagedByGoogleError = new GraphQLError(
  `Your password is managed by Google`
);
