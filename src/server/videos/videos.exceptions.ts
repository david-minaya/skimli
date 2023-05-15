import { GraphQLError } from "graphql";
import AppErrorCodes from "../../common/app-error-codes";
import { BadInputError } from "../types/base.types";

export const AssetNotFoundException = new BadInputError(`Asset not found`);
export const ClipsNotFoundException = new BadInputError(`Clips not found`);
export const SubtitleFileNotSupported = new BadInputError(
  AppErrorCodes.SUBTITLE_FILE_NOT_SUPPORTED
);
export const AudioFileNotSupported = new BadInputError(
  AppErrorCodes.AUDIO_FILE_NOT_SUPPORTED
);

export const AssetMediaNotFoundException = new BadInputError(
  `Asset media not found`
);
export const MediaNotSubtitleException = new BadInputError(
  `Asset media is not a subtitle`
);

export const AutoTranscriptionFailedException = new GraphQLError(
  `Auto transcription failed to generate`
);

export const GetSubtitleMediaException = new BadInputError(
  `mediaId or assetId is required`
);
