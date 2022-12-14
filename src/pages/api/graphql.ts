/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { createYoga } from "graphql-yoga";
import type { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";
import { schema } from "~/server/schema";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  context: ({ req }) => {
    const ip = requestIp.getClientIp(req);
    return { ip: ip };
  },
});
