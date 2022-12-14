// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
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
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  debug: SENTRY_DEBUG,
});
