/* eslint-disable quotes */
export default class AppErrorCodes {
  public static INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

  // thrown when a non .vtt file is uploaded
  public static SUBTITLE_FILE_NOT_SUPPORTED = "SUBTITLE_FILE_NOT_SUPPORTED";

  // thrown when a non .mp3 file is uploaded
  public static AUDIO_FILE_NOT_SUPPORTED = "AUDIO_FILE_NOT_SUPPORTED";

  // thrown when a not supporting image file is uploaded
  public static IMAGE_FILE_NOT_SUPPORTED = "IMAGE_FILE_NOT_SUPPORTED";

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

  // throw when calling deleteMedia mutation
  public static UNABLE_TO_DELETE_MEDIA = "UNABLE_TO_DELETE_MEDIA";

  // throw when calling deleteMedia mutation
  public static MEDIA_LINKED_TO_ASSET = "MEDIA_LINKED_TO_ASSET";

  // throw when calling billing mutations
  public static PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND";

  // throw when calling billing mutations
  public static PLAN_NOT_FOUND = "PLAN_NOT_FOUND";

  // not supposed to happen
  public static USER_NOT_FOUND = "USER_NOT_FOUND";

  // invalid product id passed for user account type
  public static USER_NOT_ELIGIBLE_FOR_PRODUCT = "USER_NOT_ELIGIBLE_FOR_PRODUCT";

  // invalid product id passed for user account type
  public static PLAN_SUBSCRIPTION_FAILED = "PLAN_SUBSCRIPTION_FAILED";

  // invalid product id passed for user account type
  public static SUBSCRIPTION_ALREADY_ACTIVE = "SUBSCRIPTION_ALREADY_ACTIVE";

  // multiple lago invoices returned
  public static FOUND_MULTIPLE_INVOICES = "FOUND_MULTIPLE_INVOICES";

  // no lago invoices returned
  public static NO_INVOICES_FOUND = "NO_INVOICES_FOUND";

  // payment status failed
  public static PAYMENT_FAILED = "PAYMENT_FAILED";

  // payment status pending
  public static PAYMENT_PENDING = "PAYMENT_PENDING";

  // feature not authorized: social media publishing
  public static SOCIAL_MEDIA_PUBLISHING_NOT_AUTHORIZED =
    "SOCIAL_MEDIA_PUBLISHING_NOT_AUTHORIZED";

  // user integration already added
  public static USER_INTEGRATION_ALREADY_EXISTS =
    "USER_INTEGRATION_ALREADY_EXISTS";

  public static FAILED_TO_GET_USER_UPGRADES = "FAILED_TO_GET_USER_UPGRADES";

  public static FAILED_TO_GET_AVAILABLE_INTEGRATIONS =
    "FAILED_TO_GET_AVAILABLE_INTEGRATIONS";

  public static FAILED_TO_GENERATE_AYRSHARE_JWT =
    "FAILED_TO_GENERATE_AYRSHARE_JWT";

  public static FAILED_TO_CREATE_AYRSHARE_PROFILE =
    "FAILED_TO_CREATE_AYRSHARE_PROFILE";

  public static FAILED_TO_GET_AYRSHARE_PROFILE =
    "FAILED_TO_GET_AYRSHARE_PROFILE";

  public static FAILED_TO_GET_INTEGRATIONS = "FAILED_TO_GET_INTEGRATIONS";
}
