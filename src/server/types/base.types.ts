import * as Sentry from "@sentry/nextjs";
import { AxiosError } from "axios";
import { GraphQLError, GraphQLErrorOptions } from "graphql";
import { GraphQLContext } from "../schema";

export type AuthInfo = {
  auth0: GraphQLContext["auth0"];
  token: GraphQLContext["token"];
};

export class APIError extends GraphQLError {
  constructor(error: AxiosError | any) {
    const code = error.response?.status || 500;
    const options: GraphQLErrorOptions = {
      extensions: {
        code: code,
        service: "api",
      },
    };
    if (code >= 500) {
      super("api error", options);
      Sentry.withScope((scope) => {
        console.error(error);
        scope.setLevel("error");
        scope.setExtra("response", error.response?.data);
        scope.setExtra("request", error.request);
      });
      console.error(error);
      Sentry.captureException(error);
    } else {
      const message = "Request Error";
      options!.extensions!.response =
        error?.response?.data?.message ||
        error?.response?.data?.messages ||
        error?.response?.data;
      super(message, options);
    }
  }
}
