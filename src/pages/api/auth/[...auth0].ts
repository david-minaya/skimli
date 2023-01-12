import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";
import "reflect-metadata";
import AppConfig from "../../../config";

export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: AppConfig.auth0.auth0GraphQLAPIAudience,
    },
  }),
  logout: handleLogout({
    returnTo: AppConfig.auth0.auth0LogoutURL,
  }),
});
