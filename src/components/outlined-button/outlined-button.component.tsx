import { Button, SxProps, Theme } from '@mui/material';
import { style } from './outlined-button.style';

interface Props {
  sx?: SxProps<Theme>;
  title: string;
  icon?: (props: any) => JSX.Element;
}

export function OutlinedButton(props: Props) {

  const {
    sx,
    title,
    icon: Icon
  } = props;

  return (
    <Button
      sx={[style.button, sx as any]}>
      {Icon && <Icon sx={style.buttonIcon}/>}
      {title}
    </Button>
  );
}
