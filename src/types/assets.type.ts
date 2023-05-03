import { Clip } from './clip.type';
import { ConvertToClipsWorkflow } from './convertToClipsWorkflow.type';
import { MuxAsset } from './muxAsset.type';
import { PostVideoWorkflow } from './postVideoWorkflow.type';

export interface AudioTrack {
  type: 'audio';
  duration: number;
  encoding: string;
  channels: string;
  sample_rate: number;
}

export interface VideoTrack {
  type: 'video';
  width: number;
  height: number;
  duration: number;
  encoding: string;
  frame_rate: number;
}

export interface Asset {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  org: number;
  name: string;
  status: 'PROCESSING' | 'UNCONVERTED' | 'CONVERTING' | 'CONVERTED' | 'DELETING' | 'ERRORED' | 'NO_CLIPS_FOUND';
  activityStartTime: string;
  activityStatus: 'QUEUED' | 'DOWNLOADING' | 'ANALYZING' | 'ASSEMBLING' | 'PUBLISHING' | 'FINISHED';
  sourceMuxAssetId?: string;
  selected: boolean;
  mux?: MuxAsset;
  metadata: {
    filesize: number;
  };
  sourceMuxInputInfo?: {
    file: {
      container_format: string;
      tracks: (AudioTrack | VideoTrack)[];
    };
  }[];
  inferenceData?: {
    human: {
      clips: Clip[];
    };
  };
  workflows?: (ConvertToClipsWorkflow | PostVideoWorkflow)[];
}
