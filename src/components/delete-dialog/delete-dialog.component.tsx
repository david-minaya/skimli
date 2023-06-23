import { Close } from '@mui/icons-material';
import { style } from './delete-dialog.style';

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
  title: string;
  description: string;
  cancelButton: string;
  confirmButton: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteDialog(props: Props) {

  const {
    open,
    title,
    description,
    cancelButton,
    confirmButton,
    onConfirm,
    onClose
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}>
      <DialogTitle sx={style.title}>
        {title}
        <IconButton 
          size='small'
          onClick={onClose}>
          <Close/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={style.description}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          sx={style.cancelButton}
          onClick={onClose}>
          {cancelButton}
        </Button>
        <Button 
          autoFocus
          onClick={onConfirm}>
          {confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
