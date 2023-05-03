import { useTranslation } from 'next-i18next';
import { Close } from '@mui/icons-material';
import { toMb } from '~/utils/toMb';
import { formatSeconds } from '~/utils/formatSeconds';
import { Asset, AudioTrack, VideoTrack } from '~/types/assets.type';
import { DetailItem } from '~/components/detail-item/detail-item.component';
import { Fragment } from 'react';
import { ConvertToClipsWorkflow } from '~/types/convertToClipsWorkflow.type';
import { style } from './workflow-status-modal.style';

import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
} from '@mui/material';

interface Props {
  open: boolean;
  asset: Asset;
  onClose: () => void;
}

export function WorkflowStatusModal(props: Props) {

  const { 
    open, 
    asset, 
    onClose 
  } = props;

  const { t } = useTranslation('library');

  function formatDate(date?: string) {

    if (!date) return '';

    const format = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      weekday: 'short',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      hour12: false,
    }).formatToParts(Date.parse(date));

    const get = (type: string) => format.find((v) => v.type === type)?.value;

    return (
      `${get('weekday')}, ` +
      `${get('day')} ` +
      `${get('month')} ` +
      `${get('year')} ` +
      `${get('hour')}:` +
      `${get('minute')}:` +
      `${get('second')} ` +
      `${get('timeZoneName')}`
    );
  }

  function calcElapsedTime() {
    const time = Date.now() - Date.parse(asset.activityStartTime);
    return formatSeconds(time / 1000);
  }

  function calcEndtime(workflow?: ConvertToClipsWorkflow) {
    const startTime = workflow?.startTime;
    const endTime = workflow?.endTime;
    if (startTime && endTime) {
      const diff = Date.parse(endTime) - Date.parse(startTime);
      return formatSeconds(diff / 1000);
    }
  }

  function getStatus(status: string) {
    if (status === 'CONVERTING') return t('workflowStatusModal.convertingStatus');
    if (status === 'CONVERTED') return t('workflowStatusModal.convertedStatus');
    if (status === 'ERRORED') return t('workflowStatusModal.errorStatus');
  }

  if (!open) {
    return null;
  }

  const videoTrack: VideoTrack = asset.sourceMuxInputInfo?.[0].file.tracks.find((track) => track.type === 'video') as any;
  const audioTrack: AudioTrack = asset.sourceMuxInputInfo?.[0].file.tracks.find((track) => track.type === 'audio') as any;
  const isCompletedOrErrored = asset.status == 'CONVERTED' || asset.status == 'ERRORED';

  const workflow: ConvertToClipsWorkflow | undefined = asset.workflows?.find(workflow => {
    return workflow.__typename === 'ConvertToClipsWorkflow'
  }) as any | undefined;

  return (
    <Dialog 
      open={open} 
      sx={style.dialog} 
      onClose={onClose}>
      <DialogTitle sx={style.title}>
        {asset.name}
        <IconButton 
          size='small' 
          onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={style.content}>
        <Box sx={style.assetIdContainer}>
          <Box sx={style.assetIdTitle}>{t('workflowStatusModal.assetIdTitle')}</Box>
          <Box sx={style.assetId}>{asset.uuid}</Box>
        </Box>
        <Box sx={style.sectionTitle}>{t('workflowStatusModal.workflowDetails')}</Box>
        <Box sx={style.sectionContent}>
          <DetailItem 
            title={t('workflowStatusModal.id')} 
            text={asset.uuid}/>
          {workflow?.category &&
            <DetailItem 
              title={t('workflowStatusModal.videoCategory')} 
              text={workflow?.category}/>
          }
          <DetailItem
            sx={style.itemTag}
            title={t('workflowStatusModal.status')}
            text={getStatus(asset.status)}/>
          <DetailItem
            title={t('workflowStatusModal.activity')}
            text={asset.activityStatus.charAt(0).toUpperCase() + asset.activityStatus.slice(1).toLowerCase()}/>
          <DetailItem
            title={t('workflowStatusModal.timeSubmitted')}
            text={formatDate(asset.activityStartTime)}/>
          <DetailItem
            title={t('workflowStatusModal.timeStarted')}
            text={formatDate(asset.activityStartTime)}/>
          {isCompletedOrErrored &&
            <Fragment>
              <DetailItem 
                title={t('workflowStatusModal.timeEnded')} 
                text={formatDate(workflow?.endTime)}/>
              <DetailItem 
                title={t('workflowStatusModal.duration')} 
                text={calcEndtime(workflow) || ''}/>
            </Fragment>
          }
          {!isCompletedOrErrored &&
            <DetailItem
              sx={style.itemElapsedTime}
              title={t('workflowStatusModal.timeElapsed')} 
              text={calcElapsedTime()}/>
          }
        </Box>
        <Box sx={style.sectionTitle}>{t('workflowStatusModal.sourceVideoDetails')}</Box>
        <Box sx={style.sectionContent}>
          <DetailItem
            title={t('workflowStatusModal.container')}
            text={asset.sourceMuxInputInfo?.[0].file.container_format || ''}/>
          <DetailItem
            title={t('workflowStatusModal.width')}
            text={videoTrack.width}/>
          <DetailItem
            title={t('workflowStatusModal.height')}
            text={videoTrack.height}/>
          <DetailItem
            title={t('workflowStatusModal.frameRate')}
            text={videoTrack.frame_rate}/>
          <DetailItem
            title={t('workflowStatusModal.encoding')}
            text={videoTrack.encoding}/>
          <DetailItem
            title={t('workflowStatusModal.duration')}
            text={videoTrack.duration}/>
          <DetailItem
            title={t('workflowStatusModal.size')}
            text={`${toMb(asset.metadata.filesize)} MB`}/>
          <Box sx={style.audioTrackTitle}>{t('workflowStatusModal.audioTrackTitle')}</Box>
          <DetailItem
            title={t('workflowStatusModal.sampleRatio')}
            text={audioTrack.sample_rate}/>
          <DetailItem
            title={t('workflowStatusModal.encoding')}
            text={audioTrack.encoding}/>
          <DetailItem
            title={t('workflowStatusModal.channels')}
            text={audioTrack.channels}/>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
