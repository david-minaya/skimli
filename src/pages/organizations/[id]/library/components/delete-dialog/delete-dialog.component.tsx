import { useTranslation } from 'next-i18next';
import { Close } from '@mui/icons-material';
import { style } from './delete-dialog.syle';

import { 
  Dialog, 
  DialogTitle, 
  IconButton, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from '@mui/material';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteDialog(props: Props) {

  const {
    open,
    onConfirm,
    onClose
  } = props;

  const { t } = useTranslation('library');

  return (
    <Dialog
      open={open}
      onClose={onClose}>
      <DialogTitle sx={style.title}>
        {t('deleteDialog.title')}
        <IconButton 
          size='small'
          onClick={onClose}>
          <Close/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={style.description}>
          {t('deleteDialog.description')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          sx={style.cancelButton}
          onClick={onClose}>
          {t('deleteDialog.cancelButton')}
        </Button>
        <Button 
          autoFocus
          onClick={onConfirm}>
          {t('deleteDialog.confirmButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
