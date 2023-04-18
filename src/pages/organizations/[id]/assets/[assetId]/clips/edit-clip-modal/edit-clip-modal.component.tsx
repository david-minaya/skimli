import MuxVideo from '@mux/mux-video-react';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogContent, styled } from '@mui/material';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { Asset } from '~/types/assets.type';
import { Clip } from '~/types/clip.type';
import { style } from './edit-clip-modal.style';
import { Volume } from '~/components/volume/volume.component';
import { PlayButton } from '~/components/play-button/play-button.component';
import { Time } from '~/components/time/time.component';
import { LoopButton } from '~/components/loop-button/loop-button.component';
import { ClipDuration } from '~/components/clip-duration/clip-duration.component';
import { EditClipModalTimeline } from '../edit-clip-modal-timeline/edit-clip-modal-timeline.component';
import { mergeSx } from '~/utils/style';
import { UndoIcon } from '~/icons/undoIcon';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { ConfirmDialog } from '~/components/confirm-dialog/confirm-dialog.component';
import { formatSeconds } from '~/utils/formatSeconds';
import { Toast } from '~/components/toast/toast.component';
import { useAdjustClip } from '~/graphqls/useAdjustClip';
import { useAssets } from '~/store/assets.slice';
import { toTime } from '~/utils/toTime';

const Video = styled(MuxVideo)``;

interface Props {
  open: boolean;
  clip: Clip;
  asset: Asset;
  onClose: () => void;
}

export function EditClipModal(props: Props) {

  const {
    open,
    clip,
    asset,
    onClose
  } = props;

  const videoPlayer = useVideoPlayer();
  const previewRef = useRef<HTMLVideoElement>(null);
  const Assets = useAssets();
  const adjustClip = useAdjustClip();
  const [startTime, setStartTime] = useState(clip.startTime);
  const [endTime, setEndTime] = useState(clip.endTime);
  const [showPreview, setShowPreview] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openDuplicatedToast, setOpenDuplicatedToast] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);
  const [duplicatedClip, setDuplicatedClip] = useState<Clip>();
  const clipDuration = endTime - startTime;

  const { t } = useTranslation('editClips');

  useEffect(() => {
    if (open) {
      videoPlayer.onLoad(() => {
        videoPlayer.updateProgress(clip.startTime);
      });
    }
  }, [open, clip]);

  useEffect(() => {
    setStartTime(clip.startTime);
    setEndTime(clip.endTime);
  }, [clip])

  const handleVideoRef = useCallback((element?: HTMLVideoElement) => {
    if (element && !videoPlayer.video) {
      videoPlayer.setVideo(element);
    }
  }, []);

  function handleDurationChange() {
    videoPlayer.setDuration(videoPlayer.video?.duration || 0);
  }

  function handlePlayed() {
    videoPlayer.setIsPlaying(true);
  }

  function handlePlaying() {
    videoPlayer.setIsPlaying(true);
  }

  function handlePaused() {
    videoPlayer.setIsPlaying(false);
  }

  function handleWaiting() {
    videoPlayer.setIsPlaying(false);
  }

  function handleTimeUpdate() {

    if (videoPlayer.video && videoPlayer.video.currentTime > endTime) {
      
      videoPlayer.updateProgress(startTime);

      if (videoPlayer.loop) {
        videoPlayer.play();
      } else {
        videoPlayer.pause();
      }

      return;
    }
    
    videoPlayer.setCurrentTime(videoPlayer.video!.currentTime);
  }

  function handlePlay() {
    if (videoPlayer.video?.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();   
    }
  }

  function handleStartTimeChange(time: number) {

    if (endTime - time < 5) time = endTime - 5;
    if (endTime - time > 600) time = endTime - 600;

    setStartTime(time);
    previewRef.current!.currentTime = time;

    if (time >= videoPlayer.currentTime) {
      videoPlayer.updateProgress(time);
    }
  }

  function handleEndTimeChange(time: number) {

    if (time - startTime < 5) time = startTime + 5;
    if (time - startTime > 600) time = startTime + 600;
    
    setEndTime(time);
    previewRef.current!.currentTime = time;
    
    if (time <= videoPlayer.currentTime) {
      videoPlayer.updateProgress(time);
    }
  }

  function handleCurrentTimeChange(time: number) {
    videoPlayer.updateProgress(time);
  }

  function handleStartEndTimeChange(start: number, end: number) {
    setStartTime(start);
    setEndTime(end);
    videoPlayer.updateProgress(start);
  }

  function handleReset() {
    setStartTime(clip.startTime);
    setEndTime(clip.endTime);
    videoPlayer.updateProgress(clip.startTime);
  }

  function handleCancel() {

    if (clip.startTime !== startTime && clip.endTime !== endTime) {
      setOpenConfirmModal(true);
      return;
    }

    handleReset();
    onClose();
  }

  function handleConfirmCancel() {
    handleReset();
    onClose();
  }

  async function handleSave() {

    // Check if exists another clip with the same start and end time.
    const duplicated = asset.inferenceData?.human.clips.find(clip =>
      clip.uuid !== props.clip.uuid &&
      Math.trunc(clip.startTime) === Math.trunc(startTime) &&
      Math.trunc(clip.endTime) === Math.trunc(endTime)
    );

    if (duplicated) {
      setDuplicatedClip(duplicated);
      setOpenDuplicatedToast(true);
      return;
    }

    try {

      console.log('start:', toTime(startTime), 'end:', toTime(endTime));

      const response = await adjustClip(clip.uuid, asset.uuid, toTime(startTime), toTime(endTime));
      Assets.updateClip(clip.uuid, asset.uuid, { ...response, selected: true });

      console.log('saved:', response);

      handleConfirmCancel();

    } catch (err: any) {

      console.log('error:', err);

      setOpenErrorToast(true);
    }
  }

  if (!open) return null;

  return (
    <Dialog open sx={style.dialog}>
      <DialogContent sx={style.dialogContent}>
        <Box sx={style.videoContainer}>
          {/* @ts-ignore */}
          <Video
            sx={style.video}
            ref={handleVideoRef}
            playsInline={true}
            playbackId={`${asset.mux?.asset.playback_ids[0].id}?token=${asset.mux?.tokens.video}`}
            onClick={handlePlay}
            onPlay={handlePlayed}
            onPause={handlePaused}
            onWaiting={handleWaiting}
            onPlaying={handlePlaying}
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}/>
          {/* @ts-ignore */}
          <Video
            sx={mergeSx(style.videoPreview, showPreview && { visibility: 'visible' })}
            ref={previewRef}
            playsInline={true}
            playbackId={`${asset.mux?.asset.playback_ids[0].id}?token=${asset.mux?.tokens.video}`}/>
        </Box>
        <Box sx={style.controlsContainer}>
          <Box sx={style.controls}>
            <PlayButton/>
            <Time time={videoPlayer.currentTime - startTime} duration={clipDuration}/>
            <ClipDuration duration={clipDuration}/>
            <Box sx={style.horizontalSpace}/>
            <Volume/>
          </Box>
          <LoopButton/>
          <EditClipModalTimeline
            asset={asset}
            currentTime={videoPlayer.currentTime}
            startTime={startTime}
            endTime={endTime}
            duration={videoPlayer.duration}
            onCurrentTimeChange={handleCurrentTimeChange}
            onStartTimeChange={handleStartTimeChange}
            onEndTimeChange={handleEndTimeChange}
            onStartEndTimeChange={handleStartEndTimeChange}
            onPreview={() => setShowPreview(true)}
            onPreviewEnd={() => setShowPreview(false)}/>
          <Box sx={style.buttons}>
            <Button 
              sx={style.resetButton}
              startIcon={<UndoIcon/>}
              onClick={handleReset}>
              {t('editClipModal.resetButton')}
            </Button>
            <OutlinedButton 
              sx={style.cancelButton} 
              title={t('editClipModal.cancelButton')}
              onClick={handleCancel}/>
            <Button 
              variant='contained'
              disabled={startTime === clip.startTime && endTime === clip.endTime}
              onClick={handleSave}>
              {t('editClipModal.saveButton')}
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <ConfirmDialog
        open={openConfirmModal}
        text={t('editClipModal.confirmDialog')}
        onConfirm={handleConfirmCancel}
        onClose={() => setOpenConfirmModal(false)}/>
      {duplicatedClip &&
        <Toast
          open={openDuplicatedToast}
          severity='error'
          title={t('editClipModal.duplicatedToast.title')}
          description={t('editClipModal.duplicatedToast.description', { 
            caption: duplicatedClip.caption, 
            startTime: formatSeconds(duplicatedClip.startTime),
            endTime: formatSeconds(duplicatedClip.endTime)
          })}
          onClose={() => setOpenDuplicatedToast(false)}/>
      }
      <Toast
        open={openErrorToast}
        severity='error'
        description={t('editClipModal.errorToast')}
        onClose={() => setOpenErrorToast(false)}/>
    </Dialog>
  );
}
