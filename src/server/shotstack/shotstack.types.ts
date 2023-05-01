export interface IShotstackRenderClipArgs {
  src: string;
  width: number;
  height: number;
  muteAudio: boolean;
  quality: string;
  startTime: number;
  endTime: number;
  callbackUrl: string;
  prefix: string;
  filename: string;
}

export interface IShotstackRenderClipResponse {
  success: boolean;
  message: string;
  response: {
    message: string;
    id: string;
  };
}

export interface ShotstackWebhookBody {
  // edit, serve
  type: string;
  // render, copy
  action: string;
  id: string;
  // available if type is serve
  render?: string;
  owner: string;
  // "status": "done" if render, "status": "ready" if copy
  status: string;
  url: string;
  poster: any;
  thumbnail: string;
  error: any;
  // datetime
  completed: string;
}
