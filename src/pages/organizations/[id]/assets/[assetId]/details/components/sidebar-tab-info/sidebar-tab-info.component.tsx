import Box from '@mui/material/Box';
import { useTranslation } from 'next-i18next';
import { SidebarContent } from '~/components/sidebar-content/sidebar-content.component';
import { DetailItem } from '~/components/detail-item/detail-item.component';
import { Asset, AudioTrack, VideoTrack } from '~/types/assets.type';
import { toMb } from '~/utils/toMb';
import { style } from './sidebar-tab-info.style';
import { InfoIcon } from '~/icons/infoIcon';
import { IconButton, Tooltip } from '@mui/material';

interface Props {
  asset: Asset;
}

export function SidebarTabInfo(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('details');

  const tracks = asset.sourceMuxInputInfo?.[0].file.tracks;
  const videoTrack: VideoTrack = tracks?.find((track) => track.type === 'video') as any;
  const audioTrack: AudioTrack = tracks?.find((track) => track.type === 'audio') as any;

  return (
    <SidebarContent 
      id='info'
      title='Details'>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.container')}
        text={
          <Tooltip
            componentsProps={{ tooltip: { sx: style.tooltip } }}
            title={asset.sourceMuxInputInfo?.[0].file.container_format}
            placement='top'>
            <IconButton sx={style.iconButton}>
              <InfoIcon sx={style.icon}/>
            </IconButton>
          </Tooltip>
        }/>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.width')}
        text={videoTrack.width}/>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.height')}
        text={videoTrack.height}/>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.frameRate')}
        text={videoTrack.frame_rate}/>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.encoding')}
        text={videoTrack.encoding}/>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.duration')}
        text={videoTrack.duration}/>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.size')}
        text={`${toMb(asset.metadata.filesize)} MB`}/>
      <Box sx={style.audioTrackTitle}>{t('infoTab.audioTrackTitle')}</Box>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.sampleRatio')}
        text={audioTrack.sample_rate}/>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.encoding')}
        text={audioTrack.encoding}/>
      <DetailItem
        sx={style.detailItem}
        title={t('infoTab.channels')}
        text={audioTrack.channels}/>
    </SidebarContent>
  );
}
