import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import AppConfig from "../../config";

export default withApiAuthRequired(async function getToken(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res, {
      authorizationParams: {
        audience: AppConfig.auth0.auth0GraphQLAPIAudience,
      },
    });
    return res.status(200).json({ accessToken });
  } catch (e) {
    console.warn("session expired: ", e);
    return res.status(400).send("session expired");
  }
});
