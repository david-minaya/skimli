import Box from '@mui/material/Box';
import { useTranslation } from 'next-i18next';
import { Youtube } from '~/icons/youtube';
import { Linkedin } from '~/icons/linkedin';
import { Facebook } from '~/icons/facebook';
import { Twitter } from '~/icons/twitter';
import { Instagram } from '~/icons/instagram';
import { Tiktok } from '~/icons/tiktok';
import { SidebarContent } from '~/components/sidebar-content/sidebar-content.component';
import { AspectRatioItem } from '../aspect-ratio-item/aspect-ratio-item.component';
import { Asset } from '~/types/assets.type';
import { useGetThumbnail } from '~/graphqls/useGetThumbnail';
import { useAssets } from '~/store/assets.slice';
import { useEditClipPage } from '~/store/editClipPage.slice';
import { VideoTrack } from '~/types/videoTrack.type';
import { useGetSupportedConversions } from '~/graphqls/useGetSupportedConversions';
import { style } from './sidebar-share.style';

interface Props {
  asset: Asset;
}

export function SidebarShare(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('editClips');
  const Assets = useAssets();
  const editClipPageState = useEditClipPage();
  const clip = Assets.getClip(asset.uuid);
  const renderingClip = editClipPageState.getRenderingClip();
  const aspectRatios = useGetSupportedConversions(asset.metadata.aspectRatio.dimension);
  const thumbnail = useGetThumbnail(asset.mux!.asset.playback_ids[0].id, undefined, undefined, clip?.startTime);
  const tracks = asset.sourceMuxInputInfo?.[0].file.tracks;
  const videoTrack = tracks?.find((track): track is VideoTrack => track.type === 'video');

  const aspectRatiosMap = {
    '1:1': {
      title: t('shareTab.aspectRatioItems.square.title'),
      description: t('shareTab.aspectRatioItems.square.description')
    },
    '2:3': {
      title: '2:3'
    },
    '4:5': {
      title: t('shareTab.aspectRatioItems.rect.title'),
      description: t('shareTab.aspectRatioItems.rect.description')
    },
    '9:16': {
      title: t('shareTab.aspectRatioItems.portrait.title'),
      description: t('shareTab.aspectRatioItems.portrait.description')
    },
    '16:9': {
      title: '16:9'
    },
    '16:10': {
      title: '16:10'
    },
    '21:9': {
      title: '21:9'
    }
  };

  return (
    <SidebarContent
      id='share'
      title={t('shareTab.share')}
      sx={!renderingClip 
        ? style.sidebarContent 
        : style.sidebarContentRenderingClip
      }>
      {!renderingClip &&
        <Box sx={style.container}>
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
              image={thumbnail}
              aspectRatio={asset.metadata.aspectRatio.dimension}
              clip={clip}
              asset={asset}
              title={asset.metadata.resolution.name === 'custom'
                ? t('shareTab.aspectRatioItems.custom.title', { width: videoTrack?.width, height: videoTrack?.height})
                : t('shareTab.aspectRatioItems.original.title', { aspectRatio: asset.metadata.aspectRatio.dimension })
              }
              description={asset.metadata.resolution.name === 'custom'
                ? t('shareTab.aspectRatioItems.custom.description')
                : t('shareTab.aspectRatioItems.original.description')
              }/>
            {aspectRatios.length > 0 &&
              <Box sx={style.convertOptions}>
                <Box sx={style.convertOptionsTitle}>Coming Soon</Box>
                {aspectRatios.map(aspectRatio => 
                  <AspectRatioItem
                    key={aspectRatio}
                    image={thumbnail}
                    aspectRatio={aspectRatio}
                    title={aspectRatiosMap[aspectRatio].title}
                    description={aspectRatiosMap[aspectRatio].description}
                    disabled={true}
                    clip={clip}
                    asset={asset}/>
                )}
              </Box>
            }
          </Box>
        </Box>
      }
      {renderingClip &&
        <Box sx={style.renderingClip}>
          <Box sx={style.renderingClipTitle}>{t('shareTab.renderingClip.title')}</Box>
          <Box sx={style.renderingClipDescription}>{t('shareTab.renderingClip.description')}</Box>
        </Box>
      }
    </SidebarContent>
  );
}
