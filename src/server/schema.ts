import { Request, Response } from "express";
import { GraphQLError } from "graphql";
import { NextApiRequest, NextApiResponse } from "next";
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import Container from "typedi";
import { AccountsResolver } from "./accounts/accounts.resolver";
import { ApiResolver } from "./api.resolver";
import { Auth0Resolver } from "./auth0/auth0.resolver";
import { BillingResolver } from "./billing/billing.resolver";
import { CategoriesResolver } from "./categories/categories.resolver";
import pubSub from "./common/pubsub";
import { validateInput } from "./format-error";
import { MuxResolver } from "./mux/mux.resolver";
import {
  ConvertToClipsWorkflowStatusResolver,
  VideosResolver,
} from "./videos/resolvers/videos.resolver";
import {
  AudioMediaDetailsResolver,
  ImageMediaDetailsResolver,
  SubtitleMediaDetailsResolver,
} from "./videos/resolvers/medias.resolver";

export const UnAuthorizedError = new GraphQLError(
  "Access denied! You need to be authorized to perform this action!"
);

export const schema = buildSchemaSync({
  resolvers: [
    ApiResolver,
    Auth0Resolver,
    AccountsResolver,
    BillingResolver,
    VideosResolver,
    MuxResolver,
    CategoriesResolver,
    ConvertToClipsWorkflowStatusResolver,
    ImageMediaDetailsResolver,
    AudioMediaDetailsResolver,
    SubtitleMediaDetailsResolver,
    // ClipDetailsRenderResolver,
  ],
  container: Container,
  validate: validateInput,
  authChecker: async ({ context }: { context: GraphQLContext }) => {
    if (!context.auth0) {
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
  req: NextApiRequest | Request;
  res: NextApiResponse | Response;
  ip: string;
}
