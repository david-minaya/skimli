import * as dotenv from "dotenv";

dotenv.config();

// Configurations

const config = {
  auth0: {
    auth0Secret: process.env.AUTH0_SECRET ?? "",
    auth0BaseURL: process.env.AUTH0_BASE_URL ?? "",
    auth0IssuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL ?? "",
    auth0ClientId: process.env.AUTH0_CLIENT_ID ?? "",
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET ?? "",
    auth0GraphQLAPIAudience: process.env.AUTH0_AUDIENCE ?? "",
    auth0Domain: process.env.AUTH0_DOMAIN ?? "",
    auth0LogoutURL: process.env.AUTH0_LOGOUT_URL ?? "",
    // custom domain cannot be used here we have to use the original one
    auth0ManagementAPIDomain: process.env.AUTH0_MANAGEMENT_API_DOMAIN ?? "",
  },
  api: {
    accountsAPIURL: process.env.ACCOUNTS_API_URL ?? "",
    videosAPIURL: process.env.VIDEOS_API_URL ?? "",
  },
  lago: {
    lagoAPIKey: process.env.LAGO_API_KEY ?? "",
    lagoAPIURL: process.env.LAGO_API_URL ?? "",
  },
  aws: {
    assetsS3Bucket: process.env.AWS_S3_ASSET_UPLOADS_BUCKET ?? "",
    awsRegion: process.env.AWS_REGION ?? "us-west-2",
    awsSQSAssetNotificationURL:
      process.env.AWS_SQS_ASSET_UPLOAD_NOTIFICATION_URL ?? "",
  },
  mux: {
    muxToken: process.env.MUX_TOKEN ?? "",
    muxSecretKey: process.env.MUX_SECRET_KEY ?? "",
    muxWebhookSigningSecret: process.env.MUX_WEBHOOK_SIGNING_SECRET ?? "",
    muxSigningKey: process.env.MUX_SECURE_PLAYBACK_SIGNING_KEY ?? "",
    muxSigningSecret: process.env.MUX_SECURE_PLAYBACK_SECRET_KEY ?? "",
    muxAPIBaseURL: "https://api.mux.com",
  },
  graphql: {
    // set to false in production env and true in dev env
    introspectionEnabled: !!process.env.GRAPHQL_INTROSPECTION_ENABLED || false,
    playgroundEnabled: !!process.env.GRAPHQL_PLAYGROUND_ENABLED || false,
  },
};

export default config;
