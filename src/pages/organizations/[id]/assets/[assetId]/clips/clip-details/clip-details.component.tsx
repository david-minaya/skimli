import { Box, LinearProgress, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { useAssets } from '~/store/assets.slice';
import { Asset } from '~/types/assets.type';
import { ClipTimeline } from '../clip-timeline/clip-timeline.component';
import { VideoPlayer } from '~/components/video-player/video-player.component';
import { EditClipModal } from '../edit-clip-modal/edit-clip-modal.component';
import { useEffect, useState } from 'react';
import { Clip } from '~/types/clip.type';
import { useAddClip } from '~/graphqls/useAddClip';
import { useAdjustClip } from '~/graphqls/useAdjustClip';
import { toTime } from '~/utils/toTime';
import { Toast } from '~/components/toast/toast.component';
import { formatSeconds } from '~/utils/formatSeconds';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { round } from '~/utils/round';
import { PlayButton } from '~/components/play-button/play-button.component';
import { Time } from '~/components/time/time.component';
import { LoopButton } from '~/components/loop-button/loop-button.component';
import { Volume } from '~/components/volume/volume.component';
import { longDate } from '~/utils/longDate';
import { CaptionButton } from '~/components/caption-button/caption-button.component';
import { useAudioContext } from '~/providers/AudioContextProvider';
import { style } from './clip-details.style';
import { useGetAssetSourceUrl } from '~/graphqls/useGetAssetSourceUrl';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { usePlayAudio } from '../play-audio/play-audio.component';

interface Props {
  asset: Asset;
}

export function ClipDetails(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('editClips');
  
  const [openAddClipModal, setOpenAddClipModal] = useState(false);
  const [openEditClipModal, setOpenEditClipModal] = useState(false);
  const [openDuplicatedToast, setOpenDuplicatedToast] = useState(false);
  const [openAddErrorToast, setOpenAddErrorToast] = useState(false);
  const [openEditErrorToast, setOpenEditErrorToast] = useState(false);
  const [duplicatedClip, setDuplicatedClip] = useState<Clip>();
  
  const audioContext = useAudioContext();
  const Assets = useAssets();
  const clip = Assets.getClip(asset.uuid);
  const timelineVideo = Assets.getTimelineVideo(asset.uuid);
  const videoPlayer = useVideoPlayer();
  const adjustClip = useAdjustClip();
  const addClip = useAddClip();
  const getAssetSourceUrl = useGetAssetSourceUrl();

  usePlayAudio(asset.uuid);

  useEffect(() => {

    videoPlayer.onLoad(() => {
      audioContext.addVideoNode(videoPlayer.video!);
    });

    videoPlayer.onPlay(() => {
      if (audioContext.context.state === 'suspended') {
        audioContext.context.resume();
      }
    });
  }, []);

  useEffect(() => {
    if (clip) {
      if (videoPlayer.video) {
        videoPlayer.updateProgress(clip.startTime);
      } else {
        videoPlayer.onLoad(() => videoPlayer.updateProgress(clip.startTime));
      }
    }
  }, [clip?.uuid]);

  useAsyncEffect(async () => {
    if (clip && !timelineVideo) {
      Assets.addTimelineClip(clip.uuid, asset.uuid, {
        start: 0,
        length: clip.duration,
        asset: {
          type: 'video',
          src: await getAssetSourceUrl(asset.uuid),
          trim: clip.startTime,
          volume: 1
        },
        sources: {
          id: asset.uuid,
          title: asset.name
        }
      });
    }
  }, [clip, timelineVideo, asset]);

  function handleTimeUpdate() {

    if (!clip) return;

    if (videoPlayer.video && videoPlayer.video.currentTime > clip.endTime) {
      
      videoPlayer.updateProgress(clip.startTime);

      if (videoPlayer.loop) {
        videoPlayer.play();
      } else {
        videoPlayer.pause();
      }

      return;
    }
    
    videoPlayer.setCurrentTime(round(videoPlayer.video!.currentTime, 3));
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
            <Typography sx={style.titleInput as any}>{clip.caption}</Typography>
            <Box sx={style.videoContainer}>
              <VideoPlayer
                sx={style.video}
                asset={asset}
                onTimeUpdate={handleTimeUpdate}/>
              <LinearProgress
                variant='determinate'
                value={(videoPlayer.currentTime - clip.startTime) * 100 / clip.duration}/>
              <Box sx={style.controls}>
                <PlayButton/>
                <Time 
                  sx={style.time} 
                  time={videoPlayer.currentTime - clip.startTime} 
                  duration={clip.duration}/>
                <LoopButton/>
                <CaptionButton/>
                <Volume/>
              </Box>
            </Box>
            <Box sx={style.info}>
              <Box sx={style.dateContainer}>
                <Box sx={style.dateTitle}>{t('dateTitle')}</Box>
                <Box sx={style.date}>{longDate(clip.createdAt)}</Box>
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
