import MuxVideo from '@mux/mux-video-react';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogContent, InputBase, styled } from '@mui/material';
import { VideoPlayerProvider, useVideoPlayer } from '~/providers/VideoPlayerProvider';
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
import { round } from '~/utils/round';

const Video = styled(MuxVideo)``;

interface Props {
  open: boolean;
  clip: Clip;
  asset: Asset;
  onSave: (clip: Clip) => Promise<void>;
  onClose: () => void;
}

function Modal(props: Props) {

  const {
    open,
    clip,
    asset,
    onSave,
    onClose
  } = props;

  const videoPlayer = useVideoPlayer();
  const previewRef = useRef<HTMLVideoElement>(null);
  const [startTime, setStartTime] = useState(clip.startTime);
  const [endTime, setEndTime] = useState(clip.endTime);
  const [showPreview, setShowPreview] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [disabledSaveButton, setDisabledSaveButton] = useState(false);
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
    
    videoPlayer.setCurrentTime(round(videoPlayer.video!.currentTime, 3));
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

  async function handleCaptionChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length <= 100) {
      setCaption(event.target.value)
    }
  }

  function handleReset() {
    setStartTime(clip.startTime);
    setEndTime(clip.endTime);
    videoPlayer.updateProgress(clip.startTime);
  }

  function handleCancel() {

    if (clip.startTime !== startTime || clip.endTime !== endTime) {
      setOpenConfirmModal(true);
      return;
    }

    onClose();
  }

  async function handleSave() {
    try {
      setDisabledSaveButton(true);
      await onSave({ ...clip, caption, startTime, endTime });
      setDisabledSaveButton(false);
    } catch {
      setDisabledSaveButton(false);
    }
  }

  function disableSaveButton() {
    return clip.uuid 
      ? (startTime === clip.startTime && endTime === clip.endTime) || disabledSaveButton
      : caption === '' || disabledSaveButton
  }

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
          {!clip.uuid &&
            <Box sx={style.inputContainer}>
              <Box sx={style.inputTitle}>
                <Box>{t('editClipModal.captionInputTitle')}</Box>
                <Box>{caption.length}/100</Box>
              </Box>
              <InputBase
                sx={style.input}
                value={caption}
                onChange={handleCaptionChange}/>
            </Box>
          }
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
              disabled={disableSaveButton()}
              onClick={handleSave}>
              {t('editClipModal.saveButton')}
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <ConfirmDialog
        open={openConfirmModal}
        text={t('editClipModal.confirmDialog')}
        onConfirm={() => onClose()}
        onClose={() => setOpenConfirmModal(false)}/>
    </Dialog>
  );
}

export function EditClipModal(props: Props) {
  if (!props.open || !props.clip) return null;
  return (
    <VideoPlayerProvider>
      <Modal {...props}/>
    </VideoPlayerProvider>
  );
}
