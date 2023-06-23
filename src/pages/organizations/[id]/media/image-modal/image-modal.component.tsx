import { Close } from '@mui/icons-material';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { ImageMedia } from '~/types/imageMedia.type';
import { style } from './image-modal.style';

interface Props {
  open: boolean;
  imageAsset: ImageMedia;
  onClose: () => void;
}

export function ImageModal(props: Props) {

  const {
    open,
    imageAsset,
    onClose
  } = props;

  return (
    <Dialog 
      open={open} 
      sx={style.dialog} 
      onClose={onClose}>
      <DialogTitle sx={style.dialogTitle}>
        <Box sx={style.title}>{imageAsset.name}</Box>
        <IconButton 
          size='small' 
          onClick={onClose}>
          <Close/>
        </IconButton>
      </DialogTitle>
      <DialogContent sx={style.content}>
        <Box
          sx={style.image}
          component='img'
          src={imageAsset.details.cdnUrl}/>
      </DialogContent>
    </Dialog>
  );
}
