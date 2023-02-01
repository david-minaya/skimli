import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { buildSchemaSync } from "type-graphql";
import Container from "typedi";
import { Auth0Resolver } from "./auth0/auth0.resolver";
import { validateInput } from "./format-error";
import { GraphQLError } from "graphql";
import { ApiResolver } from "./api.resolver";
import { AccountsResolver } from "./accounts/accounts.resolver";
import { BillingResolver } from "./billing/billing.resolver";
import { AssetsResolver } from "./assets/assets.resolver";
import pubSub from "./common/pubsub";
import { MuxResolver } from "./mux/mux.resolver";

export const UnAuthorizedError = new GraphQLError(
  "Access denied! You need to be authorized to perform this action!"
);

export const schema = buildSchemaSync({
  resolvers: [
    ApiResolver,
    Auth0Resolver,
    AccountsResolver,
    BillingResolver,
    AssetsResolver,
    MuxResolver,
  ],
  container: Container,
  validate: validateInput,
  authChecker: ({ context }) => {
    if (!context?.auth0) {
      throw UnAuthorizedError;
    }
    return true;
  },
  pubSub: pubSub,
});

export interface GraphQLContext {
  token: string;
  auth0: {
    iss: string;
    sub: string;
    aud: string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
    organization_id?: string;
  };
  req: NextApiRequest;
  res: NextApiResponse;
}
