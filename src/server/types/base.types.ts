import * as Sentry from "@sentry/nextjs";
import { AxiosError } from "axios";
import { GraphQLError, GraphQLErrorOptions } from "graphql";
import { GraphQLContext } from "../schema";
import AppErrorCodes from "../../common/app-error-codes";

export type AuthInfo = {
  auth0: GraphQLContext["auth0"];
  token: GraphQLContext["token"];
};

const INTERNAL_ERROR = "Internal Server Error";

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
      super(INTERNAL_ERROR, options);
      Sentry.withScope((scope) => {
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

export class InternalGraphQLError extends GraphQLError {
  constructor(error: any) {
    super(AppErrorCodes.INTERNAL_SERVER_ERROR, {
      extensions: {
        message: error?.message || error?.cause || error,
      },
    });
  }
}

export class MuxError extends GraphQLError {
  constructor(error: any) {
    const message = error?.messages[0] || "unknown mux error";
    super(INTERNAL_ERROR, {
      extensions: {
        service: "mux",
        message: message,
      },
    });
  }
}

export class BadInputError extends GraphQLError {
  constructor(error: string, errors: undefined | string[] = undefined) {
    super(error, {
      extensions: {
        errors: errors,
        code: "BAD_USER_INPUT",
      },
    });
  }
}
