import { Box, IconButton, InputBase } from '@mui/material';
import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CloseIcon } from '~/icons/closeIcon';
import { SearchIcon } from '~/icons/searchIcon';
import { style } from './search-field.style';

interface Props {
  onChange: (value?: string) => void;
}

export function SearchField(props: Props) {

  const { onChange } = props;

  const { t } = useTranslation('library');
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
    <Box sx={[style.container, focus && style.focus as any]}>
      <SearchIcon sx={style.icon}/>
      <InputBase 
        sx={style.input}
        value={value}
        placeholder={t('searchField.placeholder')}
        onChange={handleChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}/>
      {value.trim() !== '' &&
        <IconButton 
          size='small'
          onClick={handleClear}>
          <CloseIcon sx={style.icon}/>
        </IconButton>
      }
    </Box>
  )
}
