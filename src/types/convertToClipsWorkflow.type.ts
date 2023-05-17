import { ActivityStatus } from './activityStatus.type';
import { Status } from './status.type';

export interface ConvertToClipsWorkflow {
  __typename: 'ConvertToClipsWorkflow';
  workflowId: string;
  runId: string;
  status: Status;
  category: string;
  activityStatus: ActivityStatus;
  startTime: string;
  endTime: string;
  etc: number;
  model: string;
}
