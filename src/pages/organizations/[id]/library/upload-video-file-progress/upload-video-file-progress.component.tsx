import { UploadFiles } from '~/components/upload-files/upload-files.component';
import { useUploadVideoFiles, useUploadVideoFilesProgress } from '~/providers/UploadVideoFilesProvider';

export function UploadVideoFileProgress() {

  const { cancel } = useUploadVideoFiles();
  const uploadProgress = useUploadVideoFilesProgress();

  return (
    <UploadFiles
      uploadProgress={uploadProgress}
      onCancel={cancel}/>
  );
}
