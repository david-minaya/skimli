import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Close } from '@mui/icons-material';
import { toMb } from '~/utils/toMb';
import { formatSeconds } from '~/utils/formatSeconds';
import { Asset } from '~/types/assets.type';
import { DetailItem } from '~/components/detail-item/detail-item.component';
import { VideoTrack } from '~/types/videoTrack.type';
import { AudioTrack } from '~/types/auditoTrack.type';
import { Status } from '~/types/status.type';
import { ActivityStatus } from '~/types/activityStatus.type';
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

  const [elapsedTime, setElapsedTime] = useState(0);

  const workflow = asset.workflows?.find((w): w is ConvertToClipsWorkflow => w.__typename === 'ConvertToClipsWorkflow');
  const videoTrack = asset.sourceMuxInputInfo?.[0].file.tracks.find((track): track is VideoTrack => track.type === 'video');
  const audioTrack = asset.sourceMuxInputInfo?.[0].file.tracks.find((track): track is AudioTrack => track.type === 'audio');

  useEffect(() => {

    let intervalId: NodeJS.Timer;

    if (open && asset.status === 'CONVERTING') {
      setElapsedTime((Date.now() - Date.parse(asset.activityStartTime)) / 1000);
      intervalId = setInterval(() => {
        setElapsedTime((Date.now() - Date.parse(asset.activityStartTime)) / 1000);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    }
  }, [open, asset])

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

  function calcEndtime(workflow?: ConvertToClipsWorkflow) {
    const startTime = workflow?.startTime;
    const endTime = workflow?.endTime;
    if (startTime && endTime) {
      const diff = Date.parse(endTime) - Date.parse(startTime);
      return formatSeconds(diff / 1000);
    }
  }

  function getStatus(status: Status) {
    switch (status) {
      case 'CONVERTING': return t('workflowStatusModal.status.converting');
      case 'CONVERTED': return t('workflowStatusModal.status.converted');
      case 'ERRORED': return t('workflowStatusModal.status.error');
      case 'NO_CLIPS_FOUND': return t('workflowStatusModal.status.error');
    }
  }

  function getActivityStatus(activityStatus: ActivityStatus) {
    switch (activityStatus) {
      case 'ANALYZING': return t('workflowStatusModal.activityStatus.analyzing');
      case 'ASSEMBLING': return t('workflowStatusModal.activityStatus.assembling');
      case 'DOWNLOADING': return t('workflowStatusModal.activityStatus.downloading');
      case 'FINISHED': return t('workflowStatusModal.activityStatus.finished');
      case 'PUBLISHING': return t('workflowStatusModal.activityStatus.publishing');
      case 'QUEUED': return t('workflowStatusModal.activityStatus.queued');
    }
  }

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
            text={workflow?.workflowId}/>
          {workflow?.category &&
            <DetailItem 
              title={t('workflowStatusModal.videoCategory')} 
              text={workflow?.category}/>
          }
          <DetailItem
            sx={style.itemTag}
            title={t('workflowStatusModal.statusTitle')}
            text={getStatus(asset.status)}/>
          <DetailItem
            title={t('workflowStatusModal.activityStatusTitle')}
            text={asset.status !== 'NO_CLIPS_FOUND'
              ? getActivityStatus(asset.activityStatus)
              : t('workflowStatusModal.noClipsFounds')
            }/>
          <DetailItem
            title={t('workflowStatusModal.timeSubmitted')}
            text={formatDate(asset.activityStartTime)}/>
          <DetailItem
            title={t('workflowStatusModal.timeStarted')}
            text={formatDate(asset.activityStartTime)}/>
          {asset.status === 'CONVERTING' &&
            <DetailItem
              sx={style.itemElapsedTime}
              title={t('workflowStatusModal.timeElapsed')} 
              text={formatSeconds(elapsedTime)}/>
          }
          {asset.status !== 'CONVERTING' &&
            <Fragment>
              <DetailItem 
                title={t('workflowStatusModal.timeEnded')} 
                text={formatDate(workflow?.endTime)}/>
              <DetailItem 
                title={t('workflowStatusModal.duration')} 
                text={calcEndtime(workflow) || ''}/>
            </Fragment>
          }
        </Box>
        <Box sx={style.sectionTitle}>{t('workflowStatusModal.sourceVideoDetails')}</Box>
        <Box sx={style.sectionContent}>
          <DetailItem
            title={t('workflowStatusModal.container')}
            text={asset.sourceMuxInputInfo?.[0].file.container_format || ''}/>
          <DetailItem
            title={t('workflowStatusModal.width')}
            text={videoTrack?.width}/>
          <DetailItem
            title={t('workflowStatusModal.height')}
            text={videoTrack?.height}/>
          <DetailItem
            title={t('workflowStatusModal.aspectRatio')}
            text={`${asset.metadata.aspectRatio.decimal} (${asset.metadata.aspectRatio.dimension})`}/>
          <DetailItem
            title={t('workflowStatusModal.resolution')}
            text={`${asset.metadata.resolution.name}`}/>
          <DetailItem
            title={t('workflowStatusModal.frameRate')}
            text={videoTrack?.frame_rate}/>
          <DetailItem
            title={t('workflowStatusModal.encoding')}
            text={videoTrack?.encoding}/>
          <DetailItem
            title={t('workflowStatusModal.duration')}
            text={videoTrack?.duration}/>
          <DetailItem
            title={t('workflowStatusModal.size')}
            text={`${toMb(asset.metadata.filesize)} MB`}/>
          <Box sx={style.audioTrackTitle}>{t('workflowStatusModal.audioTrackTitle')}</Box>
          <DetailItem
            title={t('workflowStatusModal.sampleRatio')}
            text={audioTrack?.sample_rate}/>
          <DetailItem
            title={t('workflowStatusModal.encoding')}
            text={audioTrack?.encoding}/>
          <DetailItem
            title={t('workflowStatusModal.channels')}
            text={audioTrack?.channels}/>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
