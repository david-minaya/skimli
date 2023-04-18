import { useTranslation } from 'next-i18next';
import { style } from './confirm-dialog.style';

import { 
  Dialog,
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from '@mui/material';

interface Props {
  open: boolean;
  text: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog(props: Props) {

  const {
    open,
    text,
    onConfirm,
    onClose
  } = props;

  const { t } = useTranslation('components');

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogContentText sx={style.description}>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          sx={style.cancelButton}
          onClick={onClose}>
          {t('confirmDialog.cancelButton')}
        </Button>
        <Button 
          autoFocus
          onClick={onConfirm}>
          {t('confirmDialog.acceptButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
