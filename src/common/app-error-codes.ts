/* eslint-disable quotes */
export default class AppErrorCodes {
  public static INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

  // thrown when a non .vtt file is uploaded
  public static SUBTITLE_FILE_NOT_SUPPORTED = "SUBTITLE_FILE_NOT_SUPPORTED";

  // thrown when a non .mp3 file is uploaded
  public static AUDIO_FILE_NOT_SUPPORTED = "AUDIO_FILE_NOT_SUPPORTED";

  // thrown when a media with filename already exists
  public static MEDIA_FILE_EXISTS = "MEDIA_FILE_EXISTS";

  // thrown when asset is not found
  public static ASSET_NOT_FOUND = "ASSET_NOT_FOUND";

  // thrown when clip is not found
  public static CLIP_NOT_FOUND = "CLIP_NOT_FOUND";

  // thrown when asset's specific media is not found
  public static ASSET_MEDIA_NOT_FOUND = "ASSET_MEDIA_NOT_FOUND";

  // thrown when trying to get a subtitle (getSubtitleMedia) but media is not a subtitle file
  public static ASSET_IS_NOT_SUBTITLE = "ASSET_IS_NOT_SUBTITLE";

  // thrown when trying to upload a asset with duplicate filename
  public static ASSET_ALREADY_EXISTS = "ASSET_ALREADY_EXISTS";

  // thrown when trying to create a clip with same start / end time
  public static DUPLICATE_CLIP = "DUPLICATE_CLIP";

  // thrown when trying to create a clip with same start time
  public static DUPLICATE_CLIP_START_TIME = "DUPLICATE_CLIP_START_TIME";

  // thrown when auto transcription failed
  public static AUTO_TRANSCRIPTION_FAILED = "AUTO_TRANSCRIPTION_FAILED";

  // thrown when failed to render a clip
  public static RENDER_CLIP_FAILED = "RENDER_CLIP_FAILED";
}
