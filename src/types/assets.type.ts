import { AudioTrack } from './auditoTrack.type';
import { Clip } from './clip.type';
import { ConvertToClipsWorkflow } from './convertToClipsWorkflow.type';
import { MuxAsset } from './muxAsset.type';
import { Status } from './status.type';
import { PostVideoWorkflow } from './postVideoWorkflow.type';
import { VideoTrack } from './videoTrack.type';
import { ActivityStatus } from './activityStatus.type';

export interface Asset {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  org: number;
  name: string;
  status: Status;
  activityStartTime: string;
  activityStatus: ActivityStatus;
  sourceMuxAssetId?: string;
  selected: boolean;
  mux?: MuxAsset;
  metadata: {
    filesize: number;
    resolution: {
      name: string;
    }
    aspectRatio: {
      decimal: string;
      dimension: string;
    },
    transcription: {
      status: 'FAILED' | 'COMPLETED' | 'RUNNING',
      sourceUrl: string,
      workflowId: string,
      transcriptionFileStatus: 'MISSING' | 'VALID' | 'INVALID'
    }
  }
  sourceMuxInputInfo?: {
    file: {
      container_format: string;
      tracks: (AudioTrack | VideoTrack)[];
    }
  }[];
  inferenceData?: {
    human: {
      clips: Clip[];
    }
  }
  workflows?: (ConvertToClipsWorkflow | PostVideoWorkflow)[];
}
