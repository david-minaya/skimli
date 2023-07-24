import { ChangeEvent, FocusEvent, useState } from 'react';
import { Box, InputBase } from '@mui/material';
import { style } from './text-field.style';

interface Props {
  sx?: Partial<typeof style>;
  type?: string;
  title?: string;
  value: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  errorMessage?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export function TextField(props: Props) {

  const {
    sx,
    type,
    title,
    value,
    min,
    max,
    disabled = false,
    errorMessage,
    onChange,
    onBlur
  } = props;

  const [focus, setFocus] = useState(false);

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setFocus(false);
    onBlur?.(event);
  }

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
        sx={[style.input, sx?.input, focus && style.focus as any]} 
        type={type}
        value={value}
        inputProps={{ min, max }}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={handleBlur}/>
      {errorMessage &&
        <Box sx={style.errorMessage}>{errorMessage}</Box>
      }
    </Box>
  );
}
