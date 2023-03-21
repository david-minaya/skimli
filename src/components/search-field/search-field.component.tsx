import { Box, IconButton, InputBase } from '@mui/material';
import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CloseIcon } from '~/icons/closeIcon';
import { SearchIcon } from '~/icons/searchIcon';
import { style } from './search-field.style';
import { mergeSx } from '~/utils/style';

interface Props {
  sx?: Partial<typeof style>;
  onChange: (value?: string) => void;
}

export function SearchField(props: Props) {

  const { sx, onChange } = props;

  const { t } = useTranslation('components');
  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(false);

  const onDelayChange = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(value);
      }, 100);
    }
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setValue(value);
    onDelayChange(value);
  }

  function handleClear() {
    setValue('');
    onChange(undefined);
  }

  return (
    <Box 
      sx={mergeSx(style.container, focus && style.focus, sx?.container)}>
      <SearchIcon sx={mergeSx(style.icon, sx?.icon)}/>
      <InputBase 
        sx={mergeSx(style.input, sx?.input)}
        value={value}
        placeholder={t('searchField.placeholder')}
        onChange={handleChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}/>
      {value.trim() !== '' &&
        <IconButton 
          size='small'
          onClick={handleClear}>
          <CloseIcon sx={mergeSx(style.icon, sx?.icon)}/>
        </IconButton>
      }
    </Box>
  )
}
