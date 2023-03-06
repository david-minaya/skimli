import { Consumer } from "sqs-consumer";
import { Container } from "typedi";
import config from "../../config";
import {
  AcitivityStatus,
  AssetStatus,
  ConvertToClipsWorkflowStatus,
} from "../types/videos.types";
import { VideosService } from "../videos/videos.service";

const videosService = Container.get<VideosService>(VideosService);

export const videosServiceQueueProcessor = Consumer.create({
  messageAttributeNames: ["All"],
  queueUrl: config.aws.awsSQSVideosQueueURL,
  region: config.aws.awsRegion,
  handleMessage: async (message): Promise<void> => {
    try {
      const msg: ConvertToClipsWorkflowStatus = {
        activityStatus: message.MessageAttributes?.ActivityStatus
          ?.StringValue as AcitivityStatus,
        assetId: message.MessageAttributes?.AssetId?.StringValue as string,
        startTime: message.MessageAttributes?.StartTime?.StringValue as string,
        org: Number(message.MessageAttributes?.OrgId?.StringValue),
        status: message?.MessageAttributes?.Status?.StringValue as AssetStatus,
      };
      await videosService.updateConvertToClipsWorkflowStatus(msg);
    } catch (e) {
      console.error(e);
    }
  },
});
