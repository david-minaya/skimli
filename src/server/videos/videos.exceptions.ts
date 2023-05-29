import { GraphQLError } from "graphql";
import AppErrorCodes from "../../common/app-error-codes";
import { BadInputError } from "../types/base.types";

export const AssetNotFoundException = new BadInputError(
  AppErrorCodes.ASSET_NOT_FOUND
);

export const MediaNotFoundException = new BadInputError(
  AppErrorCodes.ASSET_MEDIA_NOT_FOUND
);

export const MediaLinkedToAssetException = new BadInputError(
  AppErrorCodes.MEDIA_LINKED_TO_ASSET
);

export const ClipsNotFoundException = new BadInputError(
  AppErrorCodes.CLIP_NOT_FOUND
);

export const SubtitleFileNotSupported = new BadInputError(
  AppErrorCodes.SUBTITLE_FILE_NOT_SUPPORTED
);

export const AudioFileNotSupported = new BadInputError(
  AppErrorCodes.AUDIO_FILE_NOT_SUPPORTED
);

export const ImageFileNotSupported = new BadInputError(
  AppErrorCodes.IMAGE_FILE_NOT_SUPPORTED
);

export const AssetMediaNotFoundException = new BadInputError(
  AppErrorCodes.ASSET_MEDIA_NOT_FOUND
);

export const MediaNotSubtitleException = new BadInputError(
  AppErrorCodes.ASSET_IS_NOT_SUBTITLE
);

export const AutoTranscriptionFailedException = new GraphQLError(
  AppErrorCodes.AUTO_TRANSCRIPTION_FAILED
);

export const GetSubtitleMediaException = new BadInputError(
  `mediaId or assetId is required`
);

export const RenderClipException = new BadInputError(
  AppErrorCodes.RENDER_CLIP_FAILED
);
