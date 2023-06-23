import Audio from '@mux/mux-audio-react';
import { Fragment, useRef, useState, CSSProperties, memo } from 'react';
import { useTranslation } from 'next-i18next';
import { areEqual } from 'react-window';
import { MoreHoriz } from '@mui/icons-material';
import { Box, Checkbox, IconButton, LinearProgress, Menu, MenuItem } from '@mui/material';
import { formatDate } from '~/utils/formatDate';
import { DeleteDialog } from '~/components/delete-dialog/delete-dialog.component';
import { StatusTag } from '~/components/status-tag/status-tag.component';
import { Toast } from '~/components/toast/toast.component';
import { useAssetMedias } from '~/store/assetMedias.slice';
import { mergeSx } from '~/utils/style';
import { style } from './media-item.style';
import { ImageMedia } from '~/types/imageMedia.type';
import { ImageModal } from '../image-modal/image-modal.component';
import { PlayIcon } from '~/icons/playIcon';
import { PauseIcon } from '~/icons/pauseIcon';
import { AudioAssetMedia } from '~/types/audioAssetMedia.type';
import { AssetMedia } from '~/types/assetMedia.type';

interface Props {
  index: number;
  style: CSSProperties;
  data: { 
    medias: AssetMedia[];
    showCheckBox: boolean; 
  }
}

export const MediaItem = memo(function AssetItem(props: Props) {

  const { 
    index,
    style: inlineStyle,
    data: { medias, showCheckBox },
  } = props;

  const { t } = useTranslation('media');
  const media = medias[index];
  const AssetMedias = useAssetMedias();
  const menuOptionRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPaused, setAudioPaused] = useState(true);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [hover, setHover] = useState(false);
  const [hoverAudio, setHoverAudio] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);

  function handlePlayAudio() {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }

  function handleOpenDeleteDialog() {
    setOpenDeleteDialog(true);
    setOpenMenu(false);
  }

  async function handleDelete() {
    try {
      setOpenDeleteDialog(false);
      await AssetMedias.deleteOne(media.uuid);
    } catch (err: any) {
      setOpenErrorToast(true);
    }
  }

  return (
    <Box
      style={inlineStyle}
      sx={mergeSx(style.container, media.selected && style.containerSelected)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <Checkbox 
        sx={mergeSx(style.checkBox, (hover || showCheckBox) && style.checkBoxVisible)}
        size='small'
        checked={media.selected}
        onChange={e => AssetMedias.select(media.uuid, e.target.checked)}/>
      {media.type === 'IMAGE' &&
        <Fragment>
          <Box
            sx={style.image}
            component='img'
            src={(media as ImageMedia).details.cdnUrl}
            onClick={() => setOpenImageModal(true)}/>
          <ImageModal
            open={openImageModal}
            imageAsset={media as ImageMedia}
            onClose={() => setOpenImageModal(false)}/>
        </Fragment>
      }
      {media.type === 'AUDIO' &&
        <Box 
          sx={style.audioContainer}
          onMouseEnter={() => setHoverAudio(true)}
          onMouseLeave={() => setHoverAudio(false)}>
          <Box
            sx={style.audioImage}
            component='img'
            src={audioPaused 
              ? '/images/audio.svg'
              : '/images/audio-playing.svg'
            }/>
          {!audioPaused &&
            <LinearProgress
              sx={style.progress}
              variant='determinate' 
              value={(audioProgress / audioDuration) * 100}/>
          }
          {/* @ts-ignore */}
          <Audio
            ref={audioRef}
            playbackId={`${(media as AudioAssetMedia).details?.playbackId}?token=${(media as AudioAssetMedia).details?.muxToken}`}
            onPlay={() => setAudioPaused(false)}
            onPause={() => setAudioPaused(true)}
            onDurationChange={(e) => setAudioDuration(e.currentTarget.duration)}
            onTimeUpdate={e => setAudioProgress(e.currentTarget.currentTime)}/>
          {hoverAudio &&
            <Box sx={style.playContainer}>
              <IconButton onClick={handlePlayAudio}>
                {audioPaused 
                  ? <PlayIcon sx={style.playIcon}/>
                  : <PauseIcon sx={style.playIcon}/>
                }
              </IconButton>
            </Box>
          }
        </Box>
      }
      <Box sx={style.info}>
        <Box sx={style.title}>{media.name}</Box>
        <Box sx={style.date}>{formatDate(media.createdAt)}</Box>
      </Box>
      <Box sx={style.status}>
        <StatusTag
          sx={style.notAttached}
          text={t('mediaItem.tags.notAttached')}/>
        <IconButton 
          sx={style.menuOption} 
          size='small'
          ref={menuOptionRef}
          onClick={() => setOpenMenu(true)}>
          <MoreHoriz/>
        </IconButton>
      </Box>
      <Menu
        open={openMenu}
        anchorEl={menuOptionRef.current}
        onClose={() => setOpenMenu(false)}>
        <MenuItem onClick={handleOpenDeleteDialog}>
          {t('mediaItem.menu.delete')}
        </MenuItem>
      </Menu>
      <Toast
        open={openErrorToast}
        severity='error'
        description={t('mediaItem.errorToast')}
        onClose={() => setOpenErrorToast(false)}/>
      <DeleteDialog
        open={openDeleteDialog}
        title={t('mediaItem.deleteDialog.title')}
        description={t('mediaItem.deleteDialog.description', { name: media.name })}
        confirmButton={t('mediaItem.deleteDialog.confirmButton')}
        cancelButton={t('mediaItem.deleteDialog.cancelButton')}
        onConfirm={handleDelete}
        onClose={() => setOpenDeleteDialog(false)}/>
    </Box>
  );
}, areEqual);
