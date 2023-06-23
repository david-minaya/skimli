import { UploadFiles } from '~/components/upload-files/upload-files.component';
import { useUploadMediaFiles, useUploadMediaFilesProgress } from '~/providers/UploadMediaFilesProvider';

export function UploadMediaFileProgress() {

  const { cancel } = useUploadMediaFiles();
  const uploadProgress = useUploadMediaFilesProgress();

  return (
    <UploadFiles
      uploadProgress={uploadProgress}
      onCancel={cancel}/>
  );
}
