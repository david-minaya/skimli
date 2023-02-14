import { Part } from '~/types/Part.type';
import { useGetChunkUploadUrl } from '~/graphqls/useGetPartChunkUrl';
import { useStartUpload } from '~/graphqls/useStartUpload';
import { useUploadChunk } from '~/graphqls/useUploadChunk';
import { useCompleteUpload } from '~/graphqls/useCompleteUpload';
import { AxiosProgressEvent } from 'axios';
import { useAbortUpload } from '~/graphqls/useAbortUpload';

type GetChunkUploadUrl = ReturnType<typeof useGetChunkUploadUrl>;
type StartUpload = ReturnType<typeof useStartUpload>;
type UploadChunk = ReturnType<typeof useUploadChunk>;
type CompleteUpload = ReturnType<typeof useCompleteUpload>;
type AbortUpload = ReturnType<typeof useAbortUpload>;

export class UploadFile {

  private static readonly CHUNK_SIZE = 1024 * 1024 * 10;

  private key: string;
  private uploadId: string;
  private parts: Part[] = [];
  private partCounter = 1;
  private progress = 0;
  private abortController: AbortController;
  private onProgressCallback: (bytes: number) => void;
  private onCancelledCallback: () => void;
  private onFailedCallback: (err: any) => void;
  private onCompletedCallback: () => void;

  constructor(
    private file: File,
    private startUpload: StartUpload, 
    private getChunkUploadUrl: GetChunkUploadUrl, 
    private uploadChunk: UploadChunk,
    private completeUpload: CompleteUpload,
    private abortUpload: AbortUpload
  ) { }

  async upload() {

    try {

      const response = await this.startUpload(this.file.name);

      this.key = response.key;
      this.uploadId = response.uploadId;

      for (let start = 0; start < this.file.size; start += UploadFile.CHUNK_SIZE) {
        const chunk = this.file.slice(start, start + UploadFile.CHUNK_SIZE + 1);
        await this._uploadChunk(chunk);
      }

      await this.completeUpload(this.key, this.parts, this.uploadId);
      this.onCompletedCallback();

    } catch (err: any) {

      if (err.code === 'ERR_CANCELED') {
        this.onCancelledCallback();
        return;
      }

      this.onFailedCallback(err);
    }
  }

  async cancel() {
    this.abortController?.abort();
    await this.abortUpload(this.key, this.uploadId);
  }

  private async _uploadChunk(chunk: Blob) {

    this.abortController = new AbortController();
    const url = await this.getChunkUploadUrl(this.key, this.partCounter, this.uploadId);

    // Try to upload the chunck 3 times
    for (let i = 1; i <= 3; i++) {

      try {

        const etag = await this.uploadChunk(url, this.file.type, chunk, this.abortController, this.handleProgressUpdate.bind(this));

        this.parts.push({ 
          ETag: etag, 
          PartNumber: this.partCounter 
        });

        this.partCounter++;
        
        break;

      } catch (err: any) {

        // The user cancel the upload
        if (err.code === 'ERR_CANCELED') {
          throw err;
        }

        // If upload the chunk fail 3 times, then cancel the upload
        if (i === 3) {
          throw new Error('Upload failed');
        }

        this.onProgressCallback(-this.progress);
      }
    }
  }

  private handleProgressUpdate(event: AxiosProgressEvent) {
    this.progress = event.loaded;
    this.onProgressCallback(event.bytes);
  }

  onProgress(cb: (bytes: number) => void) {
    this.onProgressCallback = cb;
  }

  onFailed(cb: (err: any) => void) {
    this.onFailedCallback = cb;
  }

  onCancelled(cb: () => void) {
    this.onCancelledCallback = cb;
  }

  onCompleted(cb: () => void) {
    this.onCompletedCallback = cb;
  }
}
