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
  },
};

export default config;
