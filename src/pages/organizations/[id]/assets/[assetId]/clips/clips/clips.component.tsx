import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Asset } from '~/types/assets.type';
import { ClipItem } from '../clip-item/clip-item.component';
import { style } from './clips.style';

interface Props {
  asset: Asset;
}

export function Clips(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('editClips');

  return (
    <Box sx={style.container}>
      <Box sx={style.title}>{t('clipListTitle')}</Box>
      <Box sx={style.clips}>
        {asset.inferenceData?.analysis.clips.map(clip => 
          <ClipItem
            key={clip.uuid}
            clip={clip}
            assetId={asset.uuid}
            playbackId={asset.mux!.asset.playback_ids[0].id}/>
        )}
      </Box>
    </Box>
  )
}
