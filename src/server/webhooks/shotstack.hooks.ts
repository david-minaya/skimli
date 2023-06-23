import { Request, Response } from "express";
import Container from "typedi";
import { VideosService } from "../videos/videos.service";
import { isUUID } from "class-validator";
import { ShotstackWebhookType } from "../shotstack/shotstack.types";

const okResponse = { ok: true };
const videosService = Container.get<VideosService>(VideosService);

export async function shostackWebhook(req: Request, res: Response) {
  const { id, type, org } = req.query;
  if (!type || !id || !org) {
    console.warn(
      "shostack webhook missing query params got: ",
      JSON.stringify(req.query)
    );
    return res.status(200).json(okResponse);
  }

  if (!isUUID(req.query?.id, "4")) {
    console.log("invalid request webhook request");
    console.log("query: ", JSON.stringify(req.query));
    console.log("body: ", JSON.stringify(req.body));
    return res.status(200).json(okResponse);
  }

  await videosService.handleShotstackWebhook({
    id: id as string,
    type: type as ShotstackWebhookType,
    org: Number(org),
    body: req.body,
  });
  return res.status(200).json(okResponse);
}
