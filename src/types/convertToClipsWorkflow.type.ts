export interface ConvertToClipsWorkflow {
  __typename: 'ConvertToClipsWorkflow';
  workflowId: string;
  runId: string;
  status: 'PROCESSING' | 'UNCONVERTED' | 'CONVERTING' | 'CONVERTED' | 'DELETING' | 'ERRORED' | 'NO_CLIPS_FOUND';
  category: string;
  activityStatus: 'QUEUED' | 'DOWNLOADING' | 'ANALYZING' | 'ASSEMBLING' | 'PUBLISHING' | 'FINISHED';
  startTime: string;
  endTime: string;
  model: string;
}
