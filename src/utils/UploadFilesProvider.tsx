import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Toast } from '~/components/toast/toast.component';
import { useAbortUpload } from '~/graphqls/useAbortUpload';
import { useCompleteUpload } from '~/graphqls/useCompleteUpload';
import { useGetChunkUploadUrl } from '~/graphqls/useGetPartChunkUrl';
import { useStartUpload } from '~/graphqls/useStartUpload';
import { useUploadChunk } from '~/graphqls/useUploadChunk';
import { useStartMediaUpload } from '~/graphqls/useStartMediaUpload';
import { UploadFile } from './uploadFile';
import { toMb } from './toMb';

interface Props {
  children: ReactNode;
}

interface UploadFiles {
  inProgress: boolean;
  completed: boolean;
  failed: boolean;
  uploadVideoFiles: (files: FileList) => Promise<void>;
  uploadMediaFiles: (files: FileList, assetId: string, hidden?: 'hidden') => Promise<void>;
  reset: () => void;
  cancel: () => Promise<void>;
}

interface UploadFilesProgress {
  hidden: boolean;
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

type OnStartUpload = (file: File) => Promise<{ key: string, uploadId: string }>;
type OnError = (err: any, file: File) => void;

const Context = createContext({} as UploadFiles);
const ProgressContext = createContext({} as UploadFilesProgress);

export function UploadFilesProvider(props: Props) {

  const { t } = useTranslation('components');

  const [uploadFile, setUploadFile] = useState<UploadFile>();
  const [hidden, setHidden] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [failed, setFailed] = useState(false);
  const [percent, setPercent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadedFilesCounter, setUploadedFilesCounter] = useState(0);
  const [errorTitle, setErrorTitle] = useState<string>();
  const [errorDescription, setErrorDescription] = useState<string>();
  const [openErrorToast, setOpenErrorToast] = useState(false);
  const [openSuccessfulToast, setOpenSuccessfulToast] = useState(false);

  const startUpload = useStartUpload();
  const startMediaUpload = useStartMediaUpload();
  const getChunkUploadUrl = useGetChunkUploadUrl();
  const completeUpload = useCompleteUpload();
  const abortUpload = useAbortUpload();
  const uploadChunk = useUploadChunk();

  const uploadVideoFiles = useCallback(async (fileList: FileList) => {

    setHidden(false);

    if (!await validate(fileList)) {
      return;
    }

    const onStartUpload: OnStartUpload = async (file) => {
      return startUpload(file.name);
    };

    const onError: OnError = (err, file) => {

      if (err.message === 'Video already exists in library') {
        setErrorTitle(t('uploadFilesProvider.fileAlreadyExistsError.title', { name: file.name }));
        setErrorDescription(t('uploadFilesProvider.fileAlreadyExistsError.description'));
        setOpenErrorToast(true);
        return;
      }

      setErrorTitle(t('uploadFilesProvider.uploadingError.title', { name: file.name }));
      setErrorDescription(t('uploadFilesProvider.uploadingError.description'));
      setOpenErrorToast(true);
    };

    await uploadFiles(fileList, onStartUpload, onError);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadMediaFiles = useCallback(async (fileList: FileList, assetId: string, hidden?: 'hidden') => {

    setHidden(hidden === 'hidden');

    const onStartUpload: OnStartUpload = async (file) => {
      return startMediaUpload(file.name, assetId, 'SUBTITLE', 'en');
    };

    const onError: OnError = (err, file) => {
      setErrorTitle(t('uploadFilesProvider.uploadingError.title', { name: file.name }));
      setErrorDescription(t('uploadFilesProvider.uploadingError.description'));
      setOpenErrorToast(true);
    };

    await uploadFiles(fileList, onStartUpload, onError);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadFiles = useCallback(async (fileList: FileList, onStartUpload: OnStartUpload, onError?: OnError) => {

    reset();

    let stop = false;
    let uploadedProgress = 0;
    
    const startTime = Date.now();
    const files = Array.from(fileList);
    const total = files.reduce((total, file) => total + file.size, 0);

    setInProgress(true);
    setTotalSize(toMb(total));
    setTotalFiles(files.length);

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return event.returnValue = t('uploadFilesProvider.preventPageExit');
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    
    for (const file of files) {

      const uploadFile = new UploadFile(
        file, 
        onStartUpload, 
        getChunkUploadUrl, 
        uploadChunk, 
        completeUpload, 
        abortUpload
      );

      uploadFile.onProgress(bytes => {

        uploadedProgress += bytes;

        const elapsedTime = (Date.now() - startTime) / 1000;
        const uploadSpeed = uploadedProgress / elapsedTime;
        const remainingTime = Math.trunc((total - uploadedProgress) / uploadSpeed);

        setDuration(remainingTime);
        setPercent(Math.trunc((uploadedProgress * 100) / total));
        setProgress(toMb(uploadedProgress));
      });

      uploadFile.onCancelled(() => {
        reset();
        stop = true;
      });

      uploadFile.onFailed((err) => {
        setFailed(true);
        setInProgress(false);
        stop = true;
        onError?.(err, file);
      });

      uploadFile.onCompleted(() => {
        setUploadedFilesCounter(counter => counter + 1);
      });

      setUploadFile(uploadFile);

      await uploadFile.upload();

      if (stop) {
        window.removeEventListener('beforeunload', onBeforeUnload);
        return;
      }
    }

    setInProgress(false);
    setCompleted(true);
    setOpenSuccessfulToast(true);

    window.removeEventListener('beforeunload', onBeforeUnload);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancel = useCallback(async () => {
    uploadFile?.cancel();
  }, [uploadFile]);

  async function validate(fileList: FileList) {

    reset();

    const files = Array.from(fileList);
    const mimetypes = process.env.NEXT_PUBLIC_SUPPORTED_MIMETYPES?.split(', ') || ['video/mp4'];
    const exts = process.env.NEXT_PUBLIC_SUPPORTED_FILES_EXT?.split(', ') || ['.mp4'];
    const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '0') * 1024 * 1024;
    const minDuration = parseInt(process.env.NEXT_PUBLIC_MIN_VIDEO_DURATION || '0') * 60;

    for (const file of files) {

      const ext = `.${file.name.split('.').pop()}`;
      const duration = await getVideoDuration(file);
      
      if (!mimetypes.includes(file.type) || !exts.includes(ext) || duration === -1) {
        setErrorTitle(t('uploadFilesProvider.unsupportedVideoFileError.title', { name: file.name }));
        setErrorDescription(t('uploadFilesProvider.unsupportedVideoFileError.description'));
        setOpenErrorToast(true);
        return false;
      }

      if (file.size > maxSize) {
        setErrorTitle(t('uploadFilesProvider.maxSizeError.title', { name: file.name }));
        setErrorDescription(t('uploadFilesProvider.maxSizeError.description', { maxSize: maxSize / (1024 * 1024 * 1024) }));
        setOpenErrorToast(true);
        return false;
      }

      if (duration < minDuration) {
        setErrorTitle(t('uploadFilesProvider.minDurationError.title', { name: file.name }));
        setErrorDescription(t('uploadFilesProvider.minDurationError.description', { duration: minDuration / 60 }));
        setOpenErrorToast(true);
        return false;
      }
    }

    return true;
  }

  function getVideoDuration(file: File) {

    return new Promise<number>(resolve => {

      const video = document.createElement('video');
  
      video.preload = 'metadata';

      video.onerror = () => {
        resolve(-1);
      };
  
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
    
      video.src = URL.createObjectURL(file);
    });
  }

  const reset = useCallback(() => {
    setUploadFile(undefined);
    setCompleted(false);
    setInProgress(false);
    setFailed(false);
    setPercent(0);
    setProgress(0);
    setDuration(0);
    setTotalSize(0);
    setTotalFiles(0);
    setUploadedFilesCounter(0);
    setOpenErrorToast(false);
    setErrorTitle(undefined);
    setErrorDescription(undefined);
  }, []);

  function handleCloseToast() {
    setOpenErrorToast(false);
    setErrorTitle(undefined);
    setErrorDescription(undefined);
  }

  const value = useMemo<UploadFiles>(() => ({
    inProgress,
    completed,
    failed,
    uploadVideoFiles,
    uploadMediaFiles,
    reset,
    cancel
  }), [inProgress, completed, failed, uploadVideoFiles, uploadMediaFiles, reset, cancel]);

  const progressContext: UploadFilesProgress = {
    hidden,
    inProgress,
    completed,
    failed,
    percent,
    progress,
    duration,
    totalSize,
    totalFiles,
    uploadedFilesCounter,
  };

  return (
    <Context.Provider value={value}>
      <ProgressContext.Provider value={progressContext}>
        {props.children}
        <Toast
          open={openErrorToast && !hidden}
          severity='error'
          title={errorTitle!}
          description={errorDescription}
          onClose={handleCloseToast}/>
        <Toast
          open={openSuccessfulToast && !hidden}
          severity='success'
          title={t('uploadFilesProvider.filesUploadCompleted.title')}
          description={t('uploadFilesProvider.filesUploadCompleted.description', { count: uploadedFilesCounter })}
          onClose={() => setOpenSuccessfulToast(false)}/>
      </ProgressContext.Provider>
    </Context.Provider>
  );
}

export function useUploadFiles() {
  return useContext(Context);
}

export function useUploadFilesProgress() {
  return useContext(ProgressContext);
}
