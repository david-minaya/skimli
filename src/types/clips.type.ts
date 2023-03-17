export interface Clip {
  uuid: string;
  caption: string;
  startTime: number;
  endTime: number;
  duration: number;
  startFrame: number;
  endFrame: number;
  source: 'MODEL' | 'HUMAN' | 'AUTOMATIC';
  selected: boolean;
}

