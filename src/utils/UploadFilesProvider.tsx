import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Toast } from '~/components/toast/toast.component';
import { useAbortUpload } from '~/graphqls/useAbortUpload';
import { useCompleteUpload } from '~/graphqls/useCompleteUpload';
import { useGetChunkUploadUrl } from '~/graphqls/useGetPartChunkUrl';
import { useStartUpload } from '~/graphqls/useStartUpload';
import { useUploadChunk } from '~/graphqls/useUploadChunk';
import { UploadFile } from './uploadFile';

interface Props {
  children: ReactNode;
}

interface UploadFiles {
  inProgress: boolean;
  completed: boolean;
  failed: boolean;
  uploadFiles: (files: FileList) => Promise<void>;
  cancel: () => Promise<void>;
}

interface UploadFilesProgress {
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

const Context = createContext({} as UploadFiles);
const ProgressContext = createContext({} as UploadFilesProgress)

export function UploadFilesProvider(props: Props) {

  const { t } = useTranslation('components');

  const [uploadFile, setUploadFile] = useState<UploadFile>();
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
  const getChunkUploadUrl = useGetChunkUploadUrl();
  const completeUpload = useCompleteUpload();
  const abortUpload = useAbortUpload();
  const uploadChunk = useUploadChunk();

  const uploadFiles = useCallback(async (fileList: FileList) => {

    reset();

    if (!await validate(fileList)) {
      return;
    }

    let stop = false;
    let uploadedProgress = 0;
    
    const startTime = Date.now();
    const files = Array.from(fileList);
    const total = files.reduce((total, file) => total + file.size, 0);
    const mb = (bytes: number) => parseFloat((bytes / (1024 * 1024)).toFixed(2));

    setInProgress(true);
    setTotalSize(mb(total));
    setTotalFiles(files.length);

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return event.returnValue = t('uploadFilesProvider.preventPageExit');
    }

    window.addEventListener('beforeunload', onBeforeUnload);
    
    for (const file of files) {

      const uploadFile = new UploadFile(file, startUpload, getChunkUploadUrl, uploadChunk, completeUpload, abortUpload);

      uploadFile.onProgress(bytes => {

        uploadedProgress += bytes;

        const elapsedTime = (Date.now() - startTime) / 1000;
        const uploadSpeed = uploadedProgress / elapsedTime;
        const remainingTime = Math.trunc((total - uploadedProgress) / uploadSpeed);

        setDuration(remainingTime);
        setPercent(Math.trunc((uploadedProgress * 100) / total));
        setProgress(mb(uploadedProgress));
      });

      uploadFile.onCancelled(() => {
        reset();
        stop = true;
      });

      uploadFile.onFailed((err) => {
        
        setFailed(true);
        setInProgress(false);
        stop = true;
        
        if (err.message === 'Video already exists in library') {
          setErrorTitle(t('uploadFilesProvider.fileAlreadyExistsError.title', { name: file.name }));
          setErrorDescription(t('uploadFilesProvider.fileAlreadyExistsError.description'));
          setOpenErrorToast(true);
          return;
        }

        setErrorTitle(t('uploadFilesProvider.uploadingError.title', { name: file.name }));
        setErrorDescription(t('uploadFilesProvider.uploadingError.description'));
        setOpenErrorToast(true);
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
      }
  
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      }
    
      video.src = URL.createObjectURL(file);
    });
  }

  function reset() {
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
  }

  function handleCloseToast() {
    setOpenErrorToast(false);
    setErrorTitle(undefined);
    setErrorDescription(undefined);
  }

  const value = useMemo<UploadFiles>(() => ({
    inProgress,
    completed,
    failed,
    uploadFiles,
    cancel
  }), [inProgress, completed, failed, uploadFiles, cancel]);

  const progressContext: UploadFilesProgress = {
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
          open={openErrorToast}
          severity='error'
          title={errorTitle!}
          description={errorDescription}
          onClose={handleCloseToast}/>
        <Toast
          open={openSuccessfulToast}
          severity='success'
          title={t('uploadFilesProvider.filesUploadCompleted.title')}
          description={t('uploadFilesProvider.filesUploadCompleted.description', { count: uploadedFilesCounter })}
          onClose={() => setOpenSuccessfulToast(false)}/>
      </ProgressContext.Provider>
    </Context.Provider>
  )
}

export function useUploadFiles() {
  return useContext(Context);
}

export function useUploadFilesProgress() {
  return useContext(ProgressContext);
}
