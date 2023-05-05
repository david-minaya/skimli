import { SidebarContent } from '~/components/sidebar-content/sidebar-content.component';
import { useTranslation } from 'next-i18next';
import { Box, InputBase, Typography } from '@mui/material';
import { ChangeEvent, useRef } from 'react';
import { useUploadFiles } from '~/utils/UploadFilesProvider';
import { UploadFiles } from '~/components/upload-files/upload-files.component';
import { useSubtitles } from '~/hooks/useSubtitles';
import { TranscriptItem } from '~/components/transcript-item/transcript-item.component';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { Asset } from '~/types/assets.type';
import { useMediaUploadSubscription } from '~/graphqls/useMediaUploadSubscription';
import { style } from './sidebar-transcript.style';

interface Props {
  asset: Asset;
  startTime?: number;
  endTime?: number;
}

export function SidebarTranscript(props: Props) {

  const { 
    asset,
    startTime = 0,
    endTime = Number.MAX_SAFE_INTEGER
  } = props;

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const videoPlayer = useVideoPlayer();
  const uploadFiles = useUploadFiles();
  const { t } = useTranslation('details');
  const { status, cues, refresh } = useSubtitles(asset.uuid);

  useMediaUploadSubscription(() => {
    refresh();
    videoPlayer.reload();
  });

  function handleInputFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      uploadFiles.uploadMediaFiles(event.target.files, asset.uuid);
    }
  }

  function handleClick(time: number) {
    videoPlayer.updateProgress(time);
  }

  function filter(cue: VTTCue) {
    return (
      cue.startTime >= startTime &&
      cue.endTime <= endTime
    );
  }

  const link = (
    <Box 
      component='span' 
      sx={style.link} 
      onClick={() => hiddenFileInputRef.current?.click()}>
      {t('sidebarTranscript.emptyLink')}
    </Box>
  );
  
  return (
    <SidebarContent 
      sx={style.sidebarContent}
      id='transcript'
      title='Transcript'>
      {status.loading &&
        'Loading...'
      }
      {status.successfull &&
        cues.filter(filter).map((cue, index) =>
          <TranscriptItem
            key={cue.startTime} 
            time={videoPlayer.currentTime}
            cue={cue}
            onClick={handleClick}/>
        )
      }
      {status.empty &&
        <Box sx={style.empty}>
          <Box
            sx={style.image}
            component='img'
            src='/images/upload-file.svg'/>
          <Typography 
            sx={style.text} 
            paragraph 
            variant='body2'>
            {t('sidebarTranscript.emptyTitle')}
          </Typography>
          <Typography 
            sx={style.text} 
            paragraph 
            variant='body2'>
            {t('sidebarTranscript.emptyTextPart1')} {link}{t('sidebarTranscript.emptyTextPart2')}
          </Typography>
          <Typography 
            sx={style.text} 
            paragraph 
            variant='body2'>
            {t('sidebarTranscript.emptyBottomText')}
          </Typography>
          <UploadFiles/>
          <InputBase
            sx={style.hiddenFileInput}
            type='file'
            inputRef={hiddenFileInputRef}
            inputProps={{ accept: '.vtt' }}
            onChange={handleInputFileChange}/>
        </Box>
      }
      {status.error &&
        'Error'
      }
    </SidebarContent>
  );
}
