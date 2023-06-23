import { useCallback, useState } from 'react';
import { useAbortUpload } from '~/graphqls/useAbortUpload';
import { useCompleteUpload } from '~/graphqls/useCompleteUpload';
import { useGetChunkUploadUrl } from '~/graphqls/useGetPartChunkUrl';
import { useStartUpload } from '~/graphqls/useStartUpload';
import { useUploadChunk } from '~/graphqls/useUploadChunk';
import { useStartMediaUpload } from '~/graphqls/useStartMediaUpload';
import { AssetMedia } from '~/types/assetMedia.type';
import { toMb } from '../utils/toMb';
import { Part } from '~/types/Part.type';

export type AssetFile = {
  file: File;
  assetType: 'video' | 'media';
  assetId?: string;
  mediaType?: AssetMedia['type'];
  lang?: string;
}

export type UploadFiles = {
  inProgress: boolean;
  completed: boolean;
  failed: boolean;
  upload: (files: FileList) => Promise<void>;
  cancel: () => Promise<void>;
}

export type UploadFilesProgress = {
  inProgress: boolean;
  completed: boolean;
  failed: boolean;
  percent: number;
  progress: number;
  duration: number;
  uploadedFilesCounter: number;
  totalSize: number;
  totalFiles: number;
}

type Context = {
  key?: string,
  uploadId?: string,
  abortController?: AbortController,
  uploadedProgress: number,
  startTime: number,
  total: number
}

export function useUploadFiles() {

  const startVideoUpload = useStartUpload();
  const startMediaUpload = useStartMediaUpload();
  const getChunkUploadUrl = useGetChunkUploadUrl();
  const completeUpload = useCompleteUpload();
  const abortUpload = useAbortUpload();
  const uploadChunk = useUploadChunk();

  const [completed, setCompleted] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [failed, setFailed] = useState(false);
  const [percent, setPercent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadedFilesCounter, setUploadedFilesCounter] = useState(0);

  const [context] = useState<Context>({
    key: undefined,
    uploadId: undefined,
    abortController: undefined,
    uploadedProgress: 0,
    startTime: 0,
    total: 0
  });

  const upload = useCallback(async (assetFiles: AssetFile[]) => {

    reset();
    
    context.startTime = Date.now();
    context.total = assetFiles.reduce((total, assetFile) => total + assetFile.file.size, 0);

    setInProgress(true);
    setTotalSize(toMb(context.total));
    setTotalFiles(assetFiles.length);

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      return event.returnValue;
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    try {

      for (const assetFile of assetFiles) {
        await uploadFile(assetFile);
      }

      setInProgress(false);
      setCompleted(true);
  
    } catch (err: any) {

      if (err.code === 'ERR_CANCELED') {
        reset();
      } else {
        setFailed(true);
        setInProgress(false);
      }

      throw err;
    
    } finally {

      window.removeEventListener('beforeunload', onBeforeUnload);
    }
  }, []);

  async function uploadFile(assetFile: AssetFile) {

    try {

      let counter = 1;
      const { key, uploadId } = await startUpload(assetFile);
      const chunkSize = 1024 * 1024 * 10;
      const parts: Part[] = [];
  
      context.key = key;
      context.uploadId = uploadId;
  
      for (let start = 0; start < assetFile.file.size; start += chunkSize) {
        const chunk = assetFile.file.slice(start, start + chunkSize);
        const part = await _uploadChunk(key, uploadId, assetFile.file, counter++, chunk);
        parts.push(part);
      }
  
      await completeUpload(key, parts, uploadId);
      setUploadedFilesCounter(state => state + 1);

    } catch (err: any) {

      throw { ...err, file: assetFile.file };
    }
  }

  async function startUpload(assetFile: AssetFile) {
    return assetFile.assetType === 'video'
      ? startVideoUpload(assetFile.file.name)
      : startMediaUpload(assetFile.file.name, assetFile.mediaType!, assetFile.assetId, assetFile.lang);
  }

  async function _uploadChunk(key: string, uploadId: string, file: File, partCounter: number, chunk: Blob) {

    let progress = 0;
    context.abortController = new AbortController();
    const url = await getChunkUploadUrl(key, partCounter, uploadId);

    // Try to upload the chunck 3 times
    for (let i = 1; i <= 3; i++) {

      try {

        const etag = await uploadChunk(url, file.type, chunk, context.abortController, (event) => {
          progress = event.loaded;
          onProgress(event.bytes);
        });

        return { 
          ETag: etag, 
          PartNumber: partCounter 
        };

      } catch (err: any) {

        // The user cancel the upload
        if (err.code === 'ERR_CANCELED') {
          throw err;
        }

        // If upload the chunk fail 3 times, then cancel the upload
        if (i === 3) {
          throw new Error('Upload failed');
        }

        onProgress(-progress);
      }
    }

    throw new Error();
  }

  function onProgress(progress: number) {

    context.uploadedProgress += progress;

    const elapsedTime = (Date.now() - context.startTime) / 1000;
    const uploadSpeed = context.uploadedProgress / elapsedTime;
    const remainingTime = Math.trunc((context.total - context.uploadedProgress) / uploadSpeed);

    setDuration(remainingTime);
    setPercent(Math.trunc((context.uploadedProgress * 100) / context.total));
    setProgress(toMb(context.uploadedProgress));
  }

  const cancel = useCallback(async () => {
    context.abortController?.abort();
    await abortUpload(context.key!, context.uploadId!);
  }, []);

  const reset = useCallback(() => {
    context.key = undefined;
    context.uploadId = undefined;
    context.abortController = undefined;
    context.uploadedProgress = 0;
    context.startTime = 0;
    context.total = 0;
    setCompleted(false);
    setInProgress(false);
    setFailed(false);
    setPercent(0);
    setProgress(0);
    setDuration(0);
    setTotalSize(0);
    setTotalFiles(0);
    setUploadedFilesCounter(0);
  }, []);

  return {
    inProgress,
    completed,
    failed,
    percent,
    progress,
    duration,
    totalSize,
    totalFiles,
    uploadedFilesCounter,
    upload,
    reset,
    cancel
  };
}
