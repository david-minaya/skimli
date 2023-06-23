import { assetUploadProcessor } from "./asset-upload.processor";
import { videosServiceQueueProcessor } from "./videos-service-queue.processor";

export async function listen() {
  if (!assetUploadProcessor.isRunning) {
    assetUploadProcessor.start();
  }

  if (!videosServiceQueueProcessor.isRunning) {
    videosServiceQueueProcessor.start();
  }

  console.log("sqs listeners started");
}
