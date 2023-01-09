import {
  handleAuth,
  handleLogin,
  handleLogout,
  handleProfile,
  Session,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
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
  profile: handleProfile({
    refetch: true,
    afterRefetch: (
      _req: NextApiRequest,
      _res: NextApiResponse,
      session: Session
    ) => {
      // example to add custom claims
      session.user["org_id"] = "asdf";
      return session;
    },
  }),
});
