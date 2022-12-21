import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import AppConfig from "../../../config";

export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: AppConfig.auth0.auth0GraphQLAPIAudience,
    },
  }),
});
