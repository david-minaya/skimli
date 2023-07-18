import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { useServer } from "graphql-ws/lib/use/ws";
import http from "http";
import next from "next";
import requestIp from "request-ip";
import { parse } from "url";
import { WebSocket } from "ws";
import AppConfig from "../config";
import { auth, decodeToken } from "./auth";
import { GraphQLContext, schema } from "./schema";
import { listen as sqsListener } from "./sqs";
import { muxWebhook, verifyMuxWebhookMiddleware } from "./webhooks/mux.hooks";
import { shostackWebhook } from "./webhooks/shotstack.hooks";
import { createProxyMiddleware } from "http-proxy-middleware";
import config from "../config";

const port = parseInt(process.env.PORT || "3001", 10);
const dev = process.env.NODE_ENV !== "production";

const expressApp = express();
const httpServer = http.createServer(expressApp);

const nextApp = next({
  dev,
  port,
});
const handle = nextApp.getRequestHandler();

const wsServer = new WebSocket.Server({
  path: "/api/graphql",
  noServer: true,
});

// eslint-disable-next-line react-hooks/rules-of-hooks
const serverCleanup = useServer(
  {
    schema,
    context: async (ctx) => {
      const token = (ctx.connectionParams?.Authorization as string) ?? "";
      if (!token) {
        return ctx;
      }
      const payload = await decodeToken(token);
      ctx["auth0"] = payload;
      ctx["token"] = token;
      return ctx;
    },
  },
  wsServer
);

const server = new ApolloServer<GraphQLContext>({
  schema: schema,
  introspection: AppConfig.graphql.introspectionEnabled,
  plugins: [
    AppConfig.graphql.playgroundEnabled
      ? ApolloServerPluginLandingPageLocalDefault()
      : ApolloServerPluginLandingPageProductionDefault(),
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

async function bootstrap() {
  await nextApp.prepare();

  await server.start();
  expressApp.use(
    "/api/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    auth,
    expressMiddleware<GraphQLContext>(server, {
      context: async ({
        req,
        res,
      }: {
        req: Request;
        res: Response;
      }): Promise<GraphQLContext> => {
        const token = req?.headers?.authorization ?? "";
        const ip = requestIp.getClientIp(req);
        return {
          ip: ip,
          req,
          res,
          token,
          auth0: (req as any)?.auth,
        };
      },
    })
  );

  expressApp.post(
    "/api/webhooks/mux",
    bodyParser.json(),
    verifyMuxWebhookMiddleware,
    muxWebhook
  );

  expressApp.post("/api/webhooks/shostack", bodyParser.json(), shostackWebhook);

  if (config.proxyEnabled) {
    expressApp.all(
      "/api/proxy/webhooks/shostack",
      createProxyMiddleware({
        target: config.api.videosAPIURL,
        logLevel: "debug",
        onError: (err, req, res) => {
          console.error("proxy error: ", JSON.stringify(err));
          return res.status(500).json({ error: true });
        },
        pathRewrite: (_, __) => "/video/v1/webhooks/shotstack",
      })
    );
  }

  expressApp.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  // to make hmr work
  httpServer.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url!, true);
    if (!pathname?.includes("webpack-hmr")) {
      wsServer.handleUpgrade(req, socket, head, function done(ws) {
        wsServer.emit("connection", ws, req);
      });
    }
  });

  // start sqs listener if listener enabled
  if (config.aws.startSqsListener) {
    await sqsListener();
  }

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: port }, resolve)
  );
}

bootstrap();
