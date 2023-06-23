import { handleLogin, withApiAuthRequired } from "@auth0/nextjs-auth0";
import AppConfig from "../../../config";

// silently login to get organization_id in jwt
export default withApiAuthRequired(
  handleLogin({
    authorizationParams: {
      audience: AppConfig.auth0.auth0GraphQLAPIAudience,
      prompt: "none",
    },
  })
);
