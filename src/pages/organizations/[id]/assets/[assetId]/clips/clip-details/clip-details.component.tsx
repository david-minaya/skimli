import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { TextField } from '~/components/text-field/text-field.component';
import { useAssets } from '~/store/assets.slice';
import { Asset } from '~/types/assets.type';
import { ClipVideoPlayer } from '../clip-video-player/clip-video-player.component';
import { style } from './clip-details.style';

interface Props {
  asset: Asset;
}

export function ClipDetails(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('editClips');
  const assetsStore = useAssets();
  const clip = assetsStore.getClip(asset.uuid);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(Date.parse(date));
  }

  return (
    <Box sx={style.container}>
      <Box sx={style.toolbar}>
        <OutlinedButton sx={style.addButton} title={t('addButton')}/>
        <OutlinedButton title={t('stitchButton')}/>
      </Box>
      {clip &&
        <Box sx={style.content}>
          <TextField
            sx={style.titleInput as any}
            value={clip.caption}/>
          <ClipVideoPlayer
            asset={asset}
            clip={clip}/>
          <Box sx={style.info}>
            <Box sx={style.dateContainer}>
              <Box sx={style.dateTitle}>{t('dateTitle')}</Box>
              <Box sx={style.date}>{formatDate(asset.inferenceData!.analysis.createdAt)}</Box>
            </Box>
            <OutlinedButton
              sx={style.resetButton} 
              title={t('resetButton')}/>
            <OutlinedButton 
              title={t('adjustButton')}/>
          </Box>
        </Box>
      }
    </Box>
  )
}
