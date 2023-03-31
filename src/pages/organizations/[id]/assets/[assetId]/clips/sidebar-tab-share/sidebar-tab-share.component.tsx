import Box from '@mui/material/Box';
import { useTranslation } from 'next-i18next';
import { Youtube } from '~/icons/youtube';
import { Linkedin } from '~/icons/linkedin';
import { Facebook } from '~/icons/facebook';
import { Twitter } from '~/icons/twitter';
import { Instagram } from '~/icons/instagram';
import { Tiktok } from '~/icons/tiktok';
import { style } from './sidebar-tab-share.style';
import { AspectRatioItem } from '../aspect-ratio-item/aspect-ratio-item.component';

interface Props {
  id: string;
}

export function SidebarTabShare(props: Props) {

  const { id } = props;
  const { t } = useTranslation('editClips');

  if (id !== 'share') return null;

  return (
    <Box sx={style.container}>
      <Box sx={style.title}>{t('shareTab.share')}</Box>
      <Box sx={style.socialMedia}>
        <Youtube/>
        <Linkedin/>
        <Facebook/>
        <Twitter/>
        <Instagram/>
        <Tiktok/>
      </Box>
      <Box sx={style.title}>{t('shareTab.download')}</Box>
      <Box sx={style.aspectRatios}>
        <AspectRatioItem
          image='/images/aspect-ratio-16x9.png'
          title={t('shareTab.aspectRatioItems.original.title')}
          description={t('shareTab.aspectRatioItems.original.description')}/>
        <AspectRatioItem
          image='/images/aspect-ratio-1x1.png'
          title={t('shareTab.aspectRatioItems.square.title')}
          description={t('shareTab.aspectRatioItems.square.description')}/>
        <AspectRatioItem
          image='/images/aspect-ratio-9x16.png'
          title={t('shareTab.aspectRatioItems.portrait.title')}
          description={t('shareTab.aspectRatioItems.portrait.description')}/>
        <AspectRatioItem
          image='/images/aspect-ratio-4x5.png'
          title={t('shareTab.aspectRatioItems.rect.title')}
          description={t('shareTab.aspectRatioItems.rect.description')}/>
      </Box>
    </Box>
  );
}
