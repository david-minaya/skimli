import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import AppConfig from "../../config";

export default withApiAuthRequired(async function getToken(req, res) {
  const { accessToken } = await getAccessToken(req, res, {
    authorizationParams: { audience: AppConfig.auth0.auth0GraphQLAPIAudience },
  });
  res.status(200).json({ accessToken });
});
