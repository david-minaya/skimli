import { Button, SxProps, Theme } from '@mui/material';
import { RefObject } from 'react';
import { style } from './outlined-button.style';

interface Props {
  sx?: SxProps<Theme>;
  title: string;
  disabled?: boolean;
  refButton?: RefObject<HTMLButtonElement>;
  icon?: (props: any) => JSX.Element;
  secondaryIcon?: (props: any) => JSX.Element;
  onClick?: () => void;
}

export function OutlinedButton(props: Props) {

  const {
    sx,
    title,
    disabled = false,
    refButton,
    icon: Icon,
    secondaryIcon: SecondaryIcon,
    onClick
  } = props;

  return (
    <Button
      sx={[style.button, sx as any]}
      disabled={disabled}
      ref={refButton}
      onClick={onClick}>
      {Icon && <Icon sx={style.icon}/>}
      {title}
      {SecondaryIcon && <SecondaryIcon sx={style.secondaryIcon}/>}
    </Button>
  );
}
