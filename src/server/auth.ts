import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import jwks, { GetVerificationKey } from "jwks-rsa";
import AppConfig from "../config";

const jwksConfig: jwks.ExpressJwtOptions = {
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${AppConfig.auth0.auth0IssuerBaseURL}/.well-known/jwks.json`,
};

const jwtConfig: jwt.VerifyOptions = {
  audience: AppConfig.auth0.auth0GraphQLAPIAudience,
  issuer: AppConfig.auth0.auth0IssuerBaseURL + "/",
  algorithms: ["RS256"],
  ignoreExpiration: true,
};

export const auth = expressjwt({
  secret: jwks.expressJwtSecret(jwksConfig) as GetVerificationKey,
  credentialsRequired: false,
  ...(jwtConfig as any),
});

const jwksClient = jwks(jwksConfig);
export async function decodeToken(beaererToken: string) {
  try {
    const token = beaererToken.split(" ").pop();
    if (!token) return null;
    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded?.header.kid;
    const signingKey = await jwksClient.getSigningKey(kid);
    const publicKey = signingKey.getPublicKey();
    const payload = jwt.verify(token, publicKey, {
      ...jwtConfig,
    });
    return payload;
  } catch (e) {
    return null;
  }
}
