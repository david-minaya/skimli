import { useTranslation } from 'next-i18next';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { AssetFile, UploadFiles as BaseUploadFiles, UploadFilesProgress, useUploadFiles } from '~/hooks/useUploadFile';
import { Toast } from '~/components/toast/toast.component';

interface UploadFiles extends Omit<BaseUploadFiles, 'upload'> {
  upload: (fileList: FileList, assetId?: string, lang?: string) => Promise<void>;
}

interface Props {
  children: ReactNode;
}

const Context = createContext({} as UploadFiles);
const ProgressContext = createContext({} as UploadFilesProgress);

export function UploadMediaFilesProvider(props: Props) {

  const uploadFiles = useUploadFiles();

  const { t } = useTranslation('components');
  const [errorTitle, setErrorTitle] = useState<string>();
  const [errorDescription, setErrorDescription] = useState<string>();
  const [openErrorToast, setOpenErrorToast] = useState(false);
  const [openSuccessfulToast, setOpenSuccessfulToast] = useState(false);

  const upload = useCallback(async (fileList: FileList, assetId?: string, lang?: string) => {

    if (!validate(fileList)) return;

    try {

      const files: AssetFile[] = Array.from(fileList).map(file => ({
        file: file,
        assetType: 'media',
        assetId: assetId,
        mediaType: getMediaType(file.type),
        lang: lang
      }));

      await uploadFiles.upload(files);
      setOpenSuccessfulToast(true);

    } catch (err: any) {

      if (err.code === 'ERR_CANCELED') return;

      setErrorTitle(t('uploadMediaProvider.errorTitle', { name: err.file.name }));
      setErrorDescription(t('uploadMediaProvider.uploadingError'));
      setOpenErrorToast(true);
    }
  }, []);

  function getMediaType(type: string) {

    const imageMimeTypes = process.env.NEXT_PUBLIC_IMAGE_MIMETYPES?.split(', ') || [];
    const audioMimeTypes = process.env.NEXT_PUBLIC_AUDIO_MIMETYPES?.split(', ') || [];

    if (imageMimeTypes.includes(type)) return 'IMAGE';
    if (audioMimeTypes.includes(type)) return 'AUDIO';
  }

  function validate(fileList: FileList) {

    const files = Array.from(fileList);

    for (const file of files) {

      if (getMediaType(file.type) === 'IMAGE') {
        return validateImage(file);
      }

      if (getMediaType(file.type) === 'AUDIO') {
        return validateAudio(file);
      }
      
      setErrorTitle(t('uploadMediaProvider.errorTitle', { name: file.name }));
      setErrorDescription(t('uploadMediaProvider.unsupportedFileError'));
      setOpenErrorToast(true);

      return false;
    }

    return true;
  }

  function validateImage(file: File) {

    const exts = process.env.NEXT_PUBLIC_IMAGE_EXTS?.split(', ') || [];
    const maxSize = parseInt(process.env.NEXT_PUBLIC_IMAGE_MAX_SIZE || '0') * 1024 * 1024;
    const ext = `.${file.name.split('.').pop()}`;

    if (!exts.includes(ext)) {
      setErrorTitle(t('uploadMediaProvider.errorTitle', { name: file.name }));
      setErrorDescription(t('uploadMediaProvider.unsupportedImageError'));
      setOpenErrorToast(true);
      return false;
    }

    if (file.size > maxSize) {
      setErrorTitle(t('uploadMediaProvider.errorTitle', { name: file.name }));
      setErrorDescription(t('uploadMediaProvider.imageMaxSizeError', { maxSize: maxSize / (1024 * 1024 * 1024) }));
      setOpenErrorToast(true);
      return false;
    }

    return true;
  }

  function validateAudio(file: File) {

    const exts = process.env.NEXT_PUBLIC_AUDIO_EXTS?.split(', ') || [];
    const maxSize = parseInt(process.env.NEXT_PUBLIC_AUDIO_MAX_SIZE || '0') * 1024 * 1024;
    const ext = `.${file.name.split('.').pop()}`;

    if (!exts.includes(ext)) {
      setErrorTitle(t('uploadMediaProvider.errorTitle', { name: file.name }));
      setErrorDescription(t('uploadMediaProvider.unsupportedAudioError'));
      setOpenErrorToast(true);
      return false;
    }

    if (file.size > maxSize) {
      setErrorTitle(t('uploadMediaProvider.errorTitle', { name: file.name }));
      setErrorDescription(t('uploadMediaProvider.audioMaxSizeError', { maxSize: maxSize / (1024 * 1024 * 1024) }));
      setOpenErrorToast(true);
      return false;
    }

    return true;
  }

  const cancel = useCallback(async () => {
    uploadFiles.cancel();
  }, [uploadFiles.cancel]);

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
          title={t('uploadMediaProvider.filesUploadCompleted.title')}
          description={t('uploadMediaProvider.filesUploadCompleted.description', { count: uploadFiles.uploadedFilesCounter })}
          onClose={() => setOpenSuccessfulToast(false)}/>
      </ProgressContext.Provider>
    </Context.Provider>
  );
}

export function useUploadMediaFiles() {
  return useContext(Context);
}

export function useUploadMediaFilesProgress() {
  return useContext(ProgressContext);
}
