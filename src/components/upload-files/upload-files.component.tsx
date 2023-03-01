import { Close } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { Box, IconButton, LinearProgress, Paper } from '@mui/material';
import { useUploadFiles, useUploadFilesProgress } from '~/utils/UploadFilesProvider';
import { style } from './upload-files.style';

export function UploadFiles() {

  const { t } = useTranslation('components');
  const { cancel } = useUploadFiles();

  const { 
    inProgress,
    percent,
    progress,
    duration,
    totalSize,
    uploadedFilesCounter,
    totalFiles
  } = useUploadFilesProgress();

  if (!inProgress) {
    return null;
  }

  async function handleCancel() {
    await cancel();
  }

  function getTime() {
    if (duration >= 60) return `${Math.trunc(duration / 60)}m`;
    if (duration < 60) return `${duration}s`;
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
            onClick={handleCancel}>
            <Close sx={style.cancelIcon}/>
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
