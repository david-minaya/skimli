import { handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import AppConfig from "../../../config";

const signupHandler = (req: NextApiRequest, res: NextApiResponse) =>
  handleLogin(req, res, {
    authorizationParams: {
      audience: AppConfig.auth0.auth0GraphQLAPIAudience,
      screen_hint: "signup",
    },
  });

export default signupHandler;
