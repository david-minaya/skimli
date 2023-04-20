import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { TextField } from '~/components/text-field/text-field.component';
import { useAssets } from '~/store/assets.slice';
import { Asset } from '~/types/assets.type';
import { ClipTimeline } from '../clip-timeline/clip-timeline.component';
import { ClipVideoPlayer } from '../clip-video-player/clip-video-player.component';
import { style } from './clip-details.style';
import { EditClipModal } from '../edit-clip-modal/edit-clip-modal.component';
import { useState } from 'react';
import { Clip } from '~/types/clip.type';
import { useAddClip } from '~/graphqls/useAddClip';
import { useAdjustClip } from '~/graphqls/useAdjustClip';
import { toTime } from '~/utils/toTime';
import { Toast } from '~/components/toast/toast.component';
import { formatSeconds } from '~/utils/formatSeconds';

interface Props {
  asset: Asset;
}

export function ClipDetails(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('editClips');
  const Assets = useAssets();
  const clip = Assets.getClip(asset.uuid);
  const adjustClip = useAdjustClip();
  const addClip = useAddClip();
  const [openAddClipModal, setOpenAddClipModal] = useState(false);
  const [openEditClipModal, setOpenEditClipModal] = useState(false);
  const [openDuplicatedToast, setOpenDuplicatedToast] = useState(false);
  const [openAddErrorToast, setOpenAddErrorToast] = useState(false);
  const [openEditErrorToast, setOpenEditErrorToast] = useState(false);
  const [duplicatedClip, setDuplicatedClip] = useState<Clip>();

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(Date.parse(date));
  }

  async function handleAddClip(clip: Clip) {

    if (isDuplicated(clip)) {
      return;
    }

    try {

      const response = await addClip(asset.uuid, clip.caption, toTime(clip.startTime), toTime(clip.endTime));
      Assets.addClip(asset.uuid, response);
      setOpenAddClipModal(false);

    } catch (err: any) {

      setOpenAddErrorToast(true);
    }
  }

  async function handleEditClip(clip: Clip) {

    if (isDuplicated(clip)) {
      return;
    }

    try {

      const response = await adjustClip(clip.uuid, asset.uuid, toTime(clip.startTime), toTime(clip.endTime));
      Assets.updateClip(clip.uuid, asset.uuid, { ...response, selected: true });
      setOpenEditClipModal(false);

    } catch (err: any) {

      setOpenEditErrorToast(true);
    }
  }

  function isDuplicated(clip: Clip) {

    // Check if exists another clip with the same start and end time.
    const duplicated = asset.inferenceData?.human.clips.find(clipItem =>
      clipItem.uuid !== clip.uuid &&
      Math.trunc(clipItem.startTime) === Math.trunc(clip.startTime) &&
      Math.trunc(clipItem.endTime) === Math.trunc(clip.endTime)
    );

    if (duplicated) {
      setDuplicatedClip(duplicated);
      setOpenDuplicatedToast(true);
      return true;
    }

    return false;
  }

  return (
    <Box sx={style.container}>
      <Box sx={style.toolbar}>
        <OutlinedButton
          sx={style.addButton} 
          title={t('addButton')}
          onClick={() => setOpenAddClipModal(true)}/>
        <OutlinedButton title={t('stitchButton')}/>
      </Box>
      <Box sx={style.content}>
        {clip &&
          <Box sx={style.center}>
            <TextField
              sx={style.titleInput as any}
              value={clip.caption}/>
            <ClipVideoPlayer
              asset={asset}
              clip={clip}/>
            <Box sx={style.info}>
              <Box sx={style.dateContainer}>
                <Box sx={style.dateTitle}>{t('dateTitle')}</Box>
                <Box sx={style.date}>{formatDate(clip.createdAt)}</Box>
              </Box>
              <OutlinedButton
                sx={style.resetButton} 
                title={t('resetButton')}/>
              <OutlinedButton 
                title={t('adjustButton')}
                onClick={() => setOpenEditClipModal(true)}/>
            </Box>
            <ClipTimeline 
              clip={clip}
              playbackId={asset.mux!.asset.playback_ids[0].id}/>
          </Box>
        }
      </Box>
      <EditClipModal
        open={openAddClipModal}
        clip={{ startTime: 0, endTime: 5 } as Clip}
        asset={asset}
        onSave={handleAddClip}
        onClose={() => setOpenAddClipModal(false)}/>
      <EditClipModal
        open={openEditClipModal}
        clip={clip!}
        asset={asset}
        onSave={handleEditClip}
        onClose={() => setOpenEditClipModal(false)}/>
      {duplicatedClip &&
        <Toast
          open={openDuplicatedToast}
          severity='error'
          title={t('clipDetails.duplicatedToast.title')}
          description={t('clipDetails.duplicatedToast.description', { 
            caption: duplicatedClip.caption, 
            startTime: formatSeconds(duplicatedClip.startTime),
            endTime: formatSeconds(duplicatedClip.endTime)
          })}
          onClose={() => setOpenDuplicatedToast(false)}/>
      }
      <Toast
        open={openAddErrorToast}
        severity='error'
        description={t('clipDetails.addErrorToast')}
        onClose={() => setOpenAddErrorToast(false)}/>
      <Toast
        open={openEditErrorToast}
        severity='error'
        description={t('clipDetails.editErrorToast')}
        onClose={() => setOpenEditErrorToast(false)}/>
    </Box>
  );
}
