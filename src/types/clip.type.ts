import { Timeline } from './shotstack';

export interface Clip {
  uuid: string;
  assetId: string;
  caption: string;
  startTime: number;
  endTime: number;
  duration: number;
  startFrame: number;
  endFrame: number;
  source: 'MODEL' | 'HUMAN' | 'AUTOMATIC';
  selected: boolean;
  createdAt: string;
  details?: {
    currentTimeline?: { timeline: Timeline };
    renderedTimeline?: { timeline: Timeline };
    renders?: {
      muteAudio: boolean;
      quality: 'LOW' | 'MEDIUM' | 'HIGH';
      url: string;
    }
  }
}
