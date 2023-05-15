export default class AppErrorCodes {
  // is thrown when a non .vtt file is uploaded
  public static SUBTITLE_FILE_NOT_SUPPORTED = "SUBTITLE_FILE_NOT_SUPPORTED";

  // is thrown when a non .mp3 file is uploaded
  public static AUDIO_FILE_NOT_SUPPORTED = "AUDIO_FILE_NOT_SUPPORTED";

  // is thrown when a media with filename already exists
  public static MEDIA_FILE_EXISTS = "MEDIA_FILE_EXISTS";

  public static INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
}
