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
  },
};

export default config;
