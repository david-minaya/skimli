export const ASSET_UPLOAD_EVENT = "assetUploads";
export const CONVERT_TO_CLIPS_TOPIC = "CONVERT_TO_CLIPS";
export const MEDIA_UPLOADED_EVENT = "MEDIA_UPLOADED";

// min clip duration in milliseconds
export const MIN_CLIP_DURATION_IN_MS = 5000;
// max clip duration in milliseconds
export const MAX_CLIP_DURATION_IN_MS = 100000;

export const MIN_CLIP_DURATION_ERROR = `Clips must be at least ${
  MIN_CLIP_DURATION_IN_MS / 1000
} seconds`;
export const MAX_CLIP_DURATION_ERROR = `Clips must be at most ${
  MAX_CLIP_DURATION_IN_MS / 1000
} seconds`;

export const SUBTITLE_FILE_EXTENSION = "vtt";
