import { Upload } from '@mui/icons-material';
import { Button, SxProps, Theme } from '@mui/material';
import { style } from './outlined-button.style';

interface Props {
  sx?: SxProps<Theme>;
  title: string;
  disabled?: boolean;
  icon?: (props: any) => JSX.Element;
  onClick?: () => void;
}

export function OutlinedButton(props: Props) {

  const {
    sx,
    title,
    disabled = false,
    icon: Icon,
    onClick
  } = props;

  return (
    <Button
      sx={[style.button, sx as any]}
      disabled={disabled}
      onClick={onClick}>
      {Icon && <Icon sx={style.icon}/>}
      {title}
    </Button>
  );
}
