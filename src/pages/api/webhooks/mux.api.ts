import "reflect-metadata";

import Mux from "@mux/mux-node";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Container from "typedi";
import AppConfig from "../../../config";
import { AssetsService } from "../../../server/assets/assets.service";

const assetsService = Container.get<AssetsService>(AssetsService);

const okResponse = { message: "ok" };

const ASSET_READY_EVENT = "video.asset.ready";
const ASSET_ERRED_EVENT = "video.asset.errored";

const verifyWebhookSignature = (
  rawBody: string | Buffer,
  req: NextApiRequest
) => {
  if (AppConfig.mux.muxWebhookSigningSecret) {
    return Mux.Webhooks.verifyHeader(
      rawBody,
      req.headers["mux-signature"] as string,
      AppConfig.mux.muxWebhookSigningSecret
    );
  } else {
    console.log(
      "Skipping webhook sig verification because no secret is configured"
    );
  }
  return true;
};

export const config = {
  runtime: "nodejs",
  api: {
    bodyParser: false,
  },
};

export default async function muxWebhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { method } = req;

  switch (method) {
    case "POST": {
      const rawBody = (await buffer(req)).toString();
      try {
        verifyWebhookSignature(rawBody, req);
      } catch (e) {
        console.error(
          "Error verifyWebhookSignature - is the correct signature secret set?",
          e
        );
        return res.status(400).json({ message: (e as Error).message });
      }
      const jsonBody = JSON.parse(rawBody);
      const { data, type } = jsonBody;

      if (!(type == ASSET_READY_EVENT || type == ASSET_ERRED_EVENT)) {
        return res.json(okResponse);
      }

      // if passthrough is not in data, it could mean the webhook request is for someother asset
      if (!("passthrough" in data)) {
        return res.json(okResponse);
      }

      try {
        const passthrough = data.passthrough;
        let payload: {
          status: string;
          passthrough: string;
          playbackIds?: any;
          assetId?: string;
        };
        if (type == ASSET_ERRED_EVENT) {
          payload = {
            status: data.status,
            passthrough: passthrough,
          };
        } else {
          payload = {
            status: data.status,
            playbackIds: data.playback_ids,
            assetId: data.id,
            passthrough: data.passthrough,
          };
        }
        await assetsService.handleMuxAssetReadyEvent(payload);
        return res.json(okResponse);
      } catch (e) {
        res.statusCode = 500;
        console.error("request error", e);
        res.json({ error: "error handling webhook" });
      }
      break;
    }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
