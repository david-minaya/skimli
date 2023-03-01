import { Box, IconButton, InputBase } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
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

  useEffect(() => {

    if (value === '') return;

    const timeout = setTimeout(() => {
      onChange(value);
    }, 100)

    return () => {
      clearTimeout(timeout);
    }
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {

    const value = event.target.value.trim();

    setValue(value);

    if (value === '') {
      onChange(undefined);
    }
  }

  function handleClear() {
    setValue('');
    onChange(undefined);
  }

  return (
    <Box sx={style.container}>
      <SearchIcon sx={style.icon}/>
      <InputBase 
        sx={style.input}
        value={value}
        placeholder={t('searchField.placeholder')}
        onChange={handleChange}/>
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
