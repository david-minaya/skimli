import { Consumer } from "sqs-consumer";
import config from "../../config";
import Container from "typedi";
import { VideosService } from "../videos/videos.service";

export type SQSMessageBody = {
  Records: Array<{
    eventVersion: string;
    eventSource: string;
    awsRegion: string;
    eventTime: string;
    eventName: string;
    userIdentity: {
      principalId: string;
    };
    requestParameters: {
      sourceIPAddress: string;
    };
    responseElements: {
      "x-amz-request-id": string;
      "x-amz-id-2": string;
    };
    s3: {
      s3SchemaVersion: string;
      configurationId: string;
      bucket: {
        name: string;
        ownerIdentity: {
          principalId: string;
        };
        arn: string;
      };
      object: {
        key: string;
        size: number;
        eTag: string;
        sequencer: string;
      };
    };
  }>;
};

const videosService = Container.get<VideosService>(VideosService);

export const sqsListener = Consumer.create({
  queueUrl: config.aws.awsSQSAssetNotificationURL,
  region: config.aws.awsRegion,
  handleMessage: async (message): Promise<void> => {
    let body = JSON.parse(message.Body!);
    body = JSON.parse(body.Message) as SQSMessageBody;
    let record: SQSMessageBody["Records"][0];
    for (record of body.Records) {
      const bucket = record?.s3.bucket.name;
      const key = record?.s3?.object?.key;
      console.log(`s3 asset uploaded: ${bucket}/${key}`);
      await videosService.handleS3AssetUploadEvent(bucket, key);
    }
  },
});

sqsListener.on("error", (err) => {
  console.error(err.message);
});

sqsListener.on("processing_error", (err) => {
  console.error(err.message);
});
