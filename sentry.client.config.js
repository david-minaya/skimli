// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENABLED = process.env.NEXT_PUBLIC_SENTRY_ENABLED;
const SENTRY_TRACING_ORIGIN = process.env.NEXT_PUBLIC_SENTRY_TRACING_ORIGIN;
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
const SENTRY_TRACES_SAMPLE_RATE =
  process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || 0.2;

console.log("SENTRY ENABLED: ", SENTRY_ENABLED);

Sentry.init({
  enabled: SENTRY_ENABLED,
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: [SENTRY_TRACING_ORIGIN, /^\//],
    }),
  ],
  tracesSampler: (ctx) => {
    if (ctx?.location?.pathname == "/api/health") {
      return 0.0;
    }
    return SENTRY_TRACES_SAMPLE_RATE;
  },
});
