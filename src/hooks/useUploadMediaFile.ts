import { useMemo, useState, useCallback } from 'react';
import { useAbortUpload } from '~/graphqls/useAbortUpload';
import { useCompleteUpload } from '~/graphqls/useCompleteUpload';
import { useGetChunkUploadUrl } from '~/graphqls/useGetPartChunkUrl';
import { useStartMediaUpload } from '~/graphqls/useStartMediaUpload';
import { useUploadChunk } from '~/graphqls/useUploadChunk';
import { UploadFile } from '~/utils/uploadFile';

export function useUploadMediaFile() {

  const startMediaUpload = useStartMediaUpload();
  const getChunkUploadUrl = useGetChunkUploadUrl();
  const completeUpload = useCompleteUpload();
  const abortUpload = useAbortUpload();
  const uploadChunk = useUploadChunk();
  const [inProgress, setInProgress] = useState(false);
  const [failed, setFailed] = useState(false);

  const upload = useCallback(async (file: File, assetId: string) => {

    setInProgress(true);
    setFailed(false);

    const onStartUpload = async (file: File): Promise<{ key: string, uploadId: string }> => {
      return startMediaUpload(file.name, 'SUBTITLE', assetId, 'en');
    };

    const uploadFile = new UploadFile(
      file, 
      onStartUpload, 
      getChunkUploadUrl, 
      uploadChunk, 
      completeUpload, 
      abortUpload
    );

    uploadFile.onFailed((err) => {
      setInProgress(false);
      setFailed(true);
      throw err;
    });

    uploadFile.onCompleted(() => {
      setInProgress(false);
    });

    await uploadFile.upload();
  }, []);

  const reset = useCallback(async () => {
    setInProgress(false);
    setFailed(false);
  }, []);

  return useMemo(() => ({
    inProgress,
    failed,
    upload,
    reset
  }), [inProgress, failed, upload, reset]);
}
