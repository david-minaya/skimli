import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { style } from './toast.style';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  severity: 'success' | 'error';
  variant?: 'filled' | 'standard' | 'outlined' | undefined;
  onClose: () => void;
}

export function Toast(props: Props) {

  const { 
    open,
    title,
    description,
    severity,
    variant = 'filled',
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
        variant={variant}
        onClose={onClose}>
        <AlertTitle>{title}</AlertTitle>
        {description}
      </Alert>
    </Snackbar>
  );
}
