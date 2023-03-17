import { MiddlewareFn } from "type-graphql";
import { IClip } from "../types/videos.types";

export function TransformClipsCaption(): MiddlewareFn {
  return async (_, next) => {
    let clips: IClip[] = await next();
    clips = clips.map((c, index) => {
      return {
        ...c,
        caption: c.caption != null ? c.caption : `Clip ${index + 1}`,
      };
    });
    return clips;
  };
}
