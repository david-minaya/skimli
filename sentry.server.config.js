// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENABLED = process.env.SENTRY_ENABLED || true;
const SENTRY_DEBUG = !!(process.env.NODE_ENV == "development");

Sentry.init({
  enabled: SENTRY_ENABLED,
  dsn:
    SENTRY_DSN ||
    "https://1df7bb4d70dd44f18ece51308e24ee3d@o1184211.ingest.sentry.io/4504277400289280",
  tracesSampleRate: 1.0,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  debug: SENTRY_DEBUG,
});
