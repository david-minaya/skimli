import { Request, Response } from "express";
import Container from "typedi";
import { VideosService } from "../videos/videos.service";
import { isUUID } from "class-validator";

const okResponse = { ok: true };
const videosService = Container.get<VideosService>(VideosService);

export async function shostackWebhook(req: Request, res: Response) {
  if (
    !req.query?.subAssetID ||
    !isUUID(req.query.subAssetID, "4") ||
    !req.body
  ) {
    console.log("invalid request webhook request");
    console.log("query: ", JSON.stringify(req.query));
    console.log("body: ", JSON.stringify(req.body));
    return res.status(200).json(okResponse);
  }

  await videosService.handleShotstackWebhook(
    req.query.subAssetID as string,
    req.body
  );

  return res.status(200).json(okResponse);
}
