import { ChangeEvent } from 'react';
import { Box, InputBase } from '@mui/material';
import { style } from './text-field.style';

interface Props {
  sx?: typeof style;
  title?: string;
  value: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export function TextField(props: Props) {

  const {
    sx,
    title,
    value,
    disabled = false,
    onChange,
    onBlur
  } = props;

  return (
    <Box 
      sx={[style.container, sx?.container as any]}>
      {title && 
        <Box 
          sx={[style.title, sx?.container as any]}>
          {title}
        </Box>
      }
      <InputBase
        sx={[style.input, sx?.input as any]} 
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}/>
    </Box>
  );
}
