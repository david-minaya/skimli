import axios from "axios";
import config from "../../config";
import { APIError } from "../types/base.types";

export function generateAuthHeaders(token: string): { Authorization: string } {
  return { Authorization: token };
}

export function isAdminURL(url: string): boolean {
  return url.includes("/admin/");
}

export async function getAppServicesM2MToken(): Promise<string> {
  try {
    const response = await axios.post(
      `https://${config.auth0.auth0ManagementAPIDomain}/oauth/token`,
      {
        client_id: config.auth0.auth0AppServicesClientId,
        client_secret: config.auth0.auth0AppServicesClientSecret,
        audience: config.auth0.auth0AppServicesAudience,
        grant_type: "client_credentials" as const,
      }
    );
    return response?.data?.access_token;
  } catch (e) {
    console.error("unable to get app-services m2m token", e);
    throw new APIError(e);
  }
}
