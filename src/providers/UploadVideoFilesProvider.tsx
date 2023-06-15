import { useTranslation } from 'next-i18next';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { AssetFile, UploadFiles, UploadFilesProgress, useUploadFiles } from '~/hooks/useUploadFile';
import { Toast } from '~/components/toast/toast.component';

interface Props {
  children: ReactNode;
}

const Context = createContext({} as UploadFiles);
const ProgressContext = createContext({} as UploadFilesProgress);

export function UploadVideoFilesProvider(props: Props) {

  const { t } = useTranslation('components');

  const [errorTitle, setErrorTitle] = useState<string>();
  const [errorDescription, setErrorDescription] = useState<string>();
  const [openErrorToast, setOpenErrorToast] = useState(false);
  const [openSuccessfulToast, setOpenSuccessfulToast] = useState(false);

  const uploadFiles = useUploadFiles();

  const upload = useCallback(async (fileList: FileList) => {

    if (await validate(fileList)) {

      try {

        const files: AssetFile[] = Array.from(fileList).map(file => ({ 
          file: file, assetType: 'video' 
        }));
  
        await uploadFiles.upload(files);
        setOpenSuccessfulToast(true);
  
      } catch (err: any) {

        if (err.code === 'ERR_CANCELED') {
          return;
        }
  
        if (err.message === 'Video already exists in library') {
          setErrorTitle(t('uploadVideoProvider.errorTitle', { name: err.file.name }));
          setErrorDescription(t('uploadVideoProvider.fileAlreadyExistsError'));
          setOpenErrorToast(true);
          return;
        }
  
        setErrorTitle(t('uploadVideoProvider.errorTitle', { name: err.file.name }));
        setErrorDescription(t('uploadVideoProvider.uploadingError'));
        setOpenErrorToast(true);
      }
    }
  }, []);

  const cancel = useCallback(async () => {
    uploadFiles.cancel();
  }, [uploadFiles.cancel]);

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
        setErrorTitle(t('uploadVideoProvider.errorTitle', { name: file.name }));
        setErrorDescription(t('uploadVideoProvider.unsupportedFileError'));
        setOpenErrorToast(true);
        return false;
      }

      if (file.size > maxSize) {
        setErrorTitle(t('uploadVideoProvider.errorTitle', { name: file.name }));
        setErrorDescription(t('uploadVideoProvider.maxSizeError', { maxSize: maxSize / (1024 * 1024 * 1024) }));
        setOpenErrorToast(true);
        return false;
      }

      if (duration < minDuration) {
        setErrorTitle(t('uploadVideoProvider.errorTitle', { name: file.name }));
        setErrorDescription(t('uploadVideoProvider.minDurationError', { duration: minDuration / 60 }));
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

  function handleCloseErrorToast() {
    setOpenErrorToast(false);
    setErrorDescription(undefined);
  }

  const value = useMemo<UploadFiles>(() => ({
    inProgress: uploadFiles.inProgress,
    completed: uploadFiles.completed,
    failed: uploadFiles.failed,
    upload: upload,
    cancel: cancel
  }), [uploadFiles, upload, cancel]);

  const progressContext: UploadFilesProgress = {
    inProgress: uploadFiles.inProgress,
    completed: uploadFiles.completed,
    failed: uploadFiles.failed,
    percent: uploadFiles.percent,
    progress: uploadFiles.progress,
    duration: uploadFiles.duration,
    totalSize: uploadFiles.totalSize,
    totalFiles: uploadFiles.totalFiles,
    uploadedFilesCounter: uploadFiles.uploadedFilesCounter,
  };

  return (
    <Context.Provider value={value}>
      <ProgressContext.Provider value={progressContext}>
        {props.children}
        <Toast
          open={openErrorToast}
          severity='error'
          title={errorTitle}
          description={errorDescription}
          onClose={handleCloseErrorToast}/>
        <Toast
          open={openSuccessfulToast}
          severity='success'
          title={t('uploadVideoProvider.filesUploadCompleted.title')}
          description={t('uploadVideoProvider.filesUploadCompleted.description', { count: uploadFiles.uploadedFilesCounter })}
          onClose={() => setOpenSuccessfulToast(false)}/>
      </ProgressContext.Provider>
    </Context.Provider>
  );
}

export function useUploadVideoFiles() {
  return useContext(Context);
}

export function useUploadVideoFilesProgress() {
  return useContext(ProgressContext);
}
