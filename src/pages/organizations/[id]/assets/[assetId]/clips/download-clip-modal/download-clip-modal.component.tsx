import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Close } from '@mui/icons-material';
import { Asset } from '~/types/assets.type';
import { Clip } from '~/types/clip.type';
import { useEditClipPage } from '~/store/editClipPage.slice';
import { useRenderClip } from '~/graphqls/useRenderClip';
import { VideoTrack } from '~/types/videoTrack.type';
import { download } from '~/utils/download';
import { style } from './download-clip-modal.style';

import { 
  Dialog, 
  DialogTitle, 
  IconButton, 
  DialogContent,
  Button, 
  Box,
  Select,
  MenuItem
} from '@mui/material';

interface Props {
  open: boolean;
  clip?: Clip;
  asset: Asset;
  aspectRatio: string;
  onClose: () => void;
}

export function DownloadClipModal(props: Props) {

  const {
    open,
    clip,
    asset,
    aspectRatio,
    onClose
  } = props;

  const editClipPageState = useEditClipPage();

  const { t } = useTranslation('editClips');
  const [quality, setQuality] = useState('MEDIUM');
  const [audio, setAudio] = useState('no');
  const [disableButton, setDisableButton] = useState(false);
  const [showError, setShowError] = useState(false);

  const tracks = asset.sourceMuxInputInfo?.[0].file.tracks;
  const videoTrack = tracks?.find((track): track is VideoTrack => track.type === 'video');

  const renderClip = useRenderClip();

  async function handleSubmit() {

    try {
    
      setShowError(false);
      setDisableButton(true);

      const { width, height } = calcDimensions();

      const url = await renderClip({
        assetId: asset.uuid,
        quality: quality as any,
        muteAudio: audio === 'yes',
        clipId: clip!.uuid,
        startTime: clip!.startTime,
        endTime: clip!.endTime,
        width: width,
        height: height
      });

      if (url) {
        download(clip!.caption, url);
      } else {
        editClipPageState.setRenderingClip(true);
      }
    
      handleClose();
    
    } catch (err: any) {
    
      setShowError(true);
      setDisableButton(false);
    }
  }

  function calcDimensions() {

    const [w, h] = aspectRatio.split(':').map(value => parseInt(value));
    
    if (videoTrack!.width < videoTrack!.height) {
      return { 
        width: videoTrack!.width, 
        height: (h / w) * videoTrack!.width 
      };
    } else {
      return { 
        width: (w / h) * videoTrack!.height, 
        height: videoTrack!.height 
      };
    }
  }

  function handleClose() {
    onClose();
    setQuality('MEDIUM');
    setAudio('no');
    setShowError(false);
    setDisableButton(false);
  }

  return (
    <Dialog
      open={open}
      sx={style.dialog}
      onClose={handleClose}>
      <DialogTitle sx={style.title}>
        {t('downloadClipModal.title')}
        <IconButton 
          size='small'
          onClick={handleClose}>
          <Close/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={style.content}>
          <Box 
            sx={style.selectTitle}>
            {t('downloadClipModal.quality')}
          </Box>
          <Select 
            sx={style.select} 
            required={true}
            value={quality}
            onChange={e => setQuality(e.target.value)}>
            <MenuItem value='LOW'>Low</MenuItem>
            <MenuItem value='MEDIUM'>Medium</MenuItem>
            <MenuItem value='HIGH'>High</MenuItem>
          </Select>
          <Box 
            sx={style.selectTitle}>
            {t('downloadClipModal.audio')}
          </Box>
          <Select 
            sx={style.select} 
            required={true}
            value={audio}
            onChange={e => setAudio(e.target.value)}>
            <MenuItem value='yes'>Yes</MenuItem>
            <MenuItem value='no'>No</MenuItem>
          </Select>
          <Button 
            sx={style.button}
            disabled={disableButton}
            variant='contained'
            onClick={handleSubmit}>
            {t('downloadClipModal.button')}
          </Button>
          {showError &&
            <Box sx={style.error}>{t('downloadClipModal.error')}</Box>
          }
        </Box>
      </DialogContent>
    </Dialog>
  );
}
