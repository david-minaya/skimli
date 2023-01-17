/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { getSession } from "@auth0/nextjs-auth0";
import { useAuth0 } from "@envelop/auth0";
import { createYoga } from "graphql-yoga";
import type { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";
import { schema, UnAuthorizedError } from "~/server/schema";
import AppConfig from "../../config";

export const config = {
  api: {
    bodyParser: false,
  },
};

const GRAPHQL_AUTH0_CONTEXT_FIELD = "auth0";
export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  landingPage: false,
  graphqlEndpoint: "/api/graphql",
  graphiql:
    process.env.NODE_ENV == "production"
      ? false
      : {
          defaultQuery: ` `,
          title: "Skimli Webapp API",
        },
  schema: schema,
  plugins: [
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAuth0({
      onError: () => {
        throw UnAuthorizedError;
      },
      domain: AppConfig.auth0.auth0Domain,
      audience: AppConfig.auth0.auth0GraphQLAPIAudience,
      extendContextField: GRAPHQL_AUTH0_CONTEXT_FIELD,
    }),
  ],
  context: ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
    const token = req?.headers?.authorization ?? "";
    const ip = requestIp.getClientIp(req);
    return { ip: ip, req, res, token };
  },
});
