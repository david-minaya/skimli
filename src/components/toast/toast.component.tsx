import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { style } from './toast.style';

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  variant?: 'filled' | 'standard' | 'outlined' | undefined;
  onClose: () => void;
}

export function Toast(props: Props) {

  const { 
    open,
    title,
    description,
    severity,
    variant = 'standard',
    onClose
  } = props;

  return (
    <Snackbar 
      open={open}
      sx={style.snakbar}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={onClose}>
      <Alert 
        sx={style.alert}
        severity={severity}
        variant={variant}
        onClose={onClose}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {description}
      </Alert>
    </Snackbar>
  );
}
