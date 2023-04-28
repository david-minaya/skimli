import { BadInputError } from "../types/base.types";
import { SUBTITLE_FILE_EXTENSION } from "./videos.constants";

export const AssetNotFoundException = new BadInputError(`Asset not found`);
export const ClipsNotFoundException = new BadInputError(`Clips not found`);
export const SubtitleFileNotSupported = new BadInputError(
  `Only ${SUBTITLE_FILE_EXTENSION} files are supported`
);
export const AssetMediaNotFoundException = new BadInputError(
  `Asset media not found`
);
export const MediaNotSubtitleException = new BadInputError(
  `Asset media is not a subtitle`
);
