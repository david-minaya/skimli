import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import Container from "typedi";
import { VideosService } from "../videos/videos.service";

const videosService = Container.get<VideosService>(VideosService);

const ASSET_READY_EVENT = "video.asset.ready";
const ASSET_ERRED_EVENT = "video.asset.errored";

// TODO: add in next pr
export function verifyMuxWebhookMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}

export async function muxWebhook(req: Request, res: Response) {
  try {
    const { data, type } = req.body;
    if (!(type == ASSET_READY_EVENT || type == ASSET_ERRED_EVENT)) {
      return res.status(200).send("ok");
    }

    // if passthrough is not in data, it could mean the webhook request is for someother asset
    if (!("passthrough" in data)) {
      return res.status(200).send("ok");
    }

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

    await videosService.handleMuxAssetReadyEvent(payload);
    return res.status(200).send("ok");
  } catch (e) {
    return res.status(200).send("ok");
  }
}
