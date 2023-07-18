export interface IRenderTimelineClipCrop {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export enum ClipFit {
  crop = "crop",
  cover = "cover",
  contain = "contain",
  none = "none",
}

export enum ClipPosition {
  top = "top",
  topRight = "topRight",
  right = "right",
  bottomRight = "bottomRight",
  bottom = "bottom",
  bottomLeft = "bottomLeft",
  left = "left",
  topLeft = "topLeft",
  center = "center",
}

export enum RenderTimelineClipAssetType {
  video = "video",
  audio = "audio",
  // used for text currently
  html = "html",
}

export interface IRenderTimelineClipAsset {
  type: RenderTimelineClipAssetType;
  volume: number;
  trim: number;
  src: string;
  crop?: IRenderTimelineClipCrop;
}

export interface IRenderTimelineClip {
  start: number;
  length: number;
  asset: IRenderTimelineClipAsset;
  fit?: ClipFit;
  scale?: number;
  position?: ClipPosition;
  // TODO: determine the types later
  sources?: any;
}

export interface IRenderTimelineTrack {
  clips: IRenderTimelineClip[];
}

export interface IRenderTimeline {
  background: string;
  tracks: IRenderTimelineTrack[];
}

export interface ITimelineOutput {
  size: { width: number; height: number };
  format: string;
  destinations: Array<{
    provider: "s3";
    options: {
      region: string;
      bucket: string;
      prefix: string;
      filename: string;
      acl: string;
    };
  }>;
}

export interface IRenderTimelineDetails {
  timeline: IRenderTimeline;
  output?: ITimelineOutput;
  callback: string;
}
