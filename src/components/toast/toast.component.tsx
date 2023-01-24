import { Alert, Snackbar } from '@mui/material';
import { style } from './toast.style';

interface Props {
  open: boolean;
  title: string;
  severity: 'success' | 'error'
  onClose: () => void;
}

export function Toast(props: Props) {

  const { 
    open,
    title,
    severity,
    onClose
  } = props;

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={onClose}>
      <Alert 
        sx={style.alert}
        severity={severity}
        variant='filled'
        onClose={onClose}>
        {title}
      </Alert>
    </Snackbar>
  );
}
