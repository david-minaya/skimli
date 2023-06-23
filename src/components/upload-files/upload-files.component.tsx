import { Close } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { Box, IconButton, LinearProgress, Paper } from '@mui/material';
import { UploadFilesProgress } from '~/hooks/useUploadFile';
import { style } from './upload-files.style';

interface Props {
  uploadProgress: UploadFilesProgress,
  onCancel: () => void;
}

export function UploadFiles(props: Props) {

  const { t } = useTranslation('components');
  const { uploadProgress, onCancel } = props;

  const {
    inProgress,
    percent,
    progress,
    duration,
    totalSize,
    uploadedFilesCounter,
    totalFiles
  } = uploadProgress;

  function getTime() {
    if (duration >= 60) return `${Math.trunc(duration / 60)}m`;
    if (duration < 60) return `${duration}s`;
  }

  if (!inProgress) {
    return null;
  }

  return (
    <Paper
      sx={style.popup} 
      elevation={1}>
      <LinearProgress
        sx={style.linearProgress}
        variant='determinate'
        value={percent}/>
      <Box sx={style.content}>
        <Box sx={style.percent}>{t('uploadFiles.percent', { percent })}</Box>
        <Box sx={style.progressContainer}>
          <Box sx={style.progress}>
            {totalFiles > 1 &&
              `${t('uploadFiles.counter', { counter: uploadedFilesCounter, total: totalFiles })}`
            }
            {t('uploadFiles.progress', { progress, size: totalSize, time: getTime() })}
          </Box>
          <IconButton
            sx={style.cancelButton}
            size='small'
            onClick={onCancel}>
            <Close sx={style.cancelIcon}/>
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
