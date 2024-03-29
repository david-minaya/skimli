import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useGetThumbnail } from '~/graphqls/useGetThumbnail';
import { useAssets } from '~/store/assets.slice';
import { Clip } from '~/types/clip.type';
import { formatSeconds } from '~/utils/formatSeconds';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { style } from './clip-item.style';

interface Props {
  assetId: string;
  playbackId: string;
  clip: Clip;
}

export function ClipItem(props: Props) {

  const {
    assetId,
    playbackId, 
    clip 
  } = props;

  const { t } = useTranslation('editClips');
  const Assets = useAssets();
  const videoPlayer = useVideoPlayer();
  const thumbnail = useGetThumbnail(playbackId, 172, 100, clip.startTime);

  function handleClick() {
    Assets.selectClip(assetId, clip.uuid);
    videoPlayer.updateProgress(clip.startTime);
  }

  return (
    <Box 
      sx={[
        style.container,
        clip.selected && style.selected as any
      ]}
      onClick={handleClick}>
      <Box sx={style.imageContainer}>
        <Box
          component='img'
          sx={style.image}
          src={thumbnail}/>
        <Box sx={style.duration}>{formatSeconds(clip.duration)}</Box>
      </Box>
      <Box sx={style.infoContainer}>
        <Box>
          <Box sx={style.title}>{clip.caption || t('noCaptionFound')}</Box>
          <Box sx={style.time}>{formatSeconds(clip.startTime)} - {formatSeconds(clip.endTime)}</Box>
        </Box>
        {clip.source !== 'HUMAN' &&
          <Box sx={style.tag}>AI</Box>
        }
      </Box>
    </Box>
  );
}
