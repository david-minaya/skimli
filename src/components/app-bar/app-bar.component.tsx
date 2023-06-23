import { Box, IconButton, MenuItem } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ClearSelectionIcon } from '~/icons/clearSelectionIcon';
import { DeleteIcon } from '~/icons/deleteIcon';
import { DropDownButton } from '../drop-down-button/drop-down-button.component';
import { SearchField } from '../search-field/search-field.component';
import { style } from './app-bar.style';

interface Props {
  title: string;
  selectedItemsCounter: number;
  disableUploadOption: boolean;
  onSearchChange: (value?: string) => void;
  onUploadFile: () => void;
  onUnselect: () => void;
  onDelete: () => void;
}

export function AppBar(props: Props) {

  const {
    title,
    selectedItemsCounter,
    disableUploadOption,
    onSearchChange,
    onUploadFile,
    onUnselect,
    onDelete
  } = props;

  const { t } = useTranslation('components');

  return (
    <Box sx={style.appBar}>
      <Box sx={style.left}>
        {selectedItemsCounter > 0 &&
          <Box sx={style.selectedContainer}>
            <IconButton 
              size='small'
              onClick={onUnselect}>
              <ClearSelectionIcon/>
            </IconButton>
            <Box sx={style.selectedTitle}>
              {title}
            </Box>
            <Box sx={style.selectedCounter}>
              {t('appBar.counter', { count: selectedItemsCounter })}
            </Box>
          </Box>
        }
        {selectedItemsCounter === 0 &&
          <Box sx={style.title}>{title}</Box>
        }
      </Box>
      <Box sx={style.center}>
        <SearchField 
          onChange={onSearchChange}/>
      </Box>
      <Box sx={style.right}>
        {selectedItemsCounter > 0 &&
          <IconButton 
            size='small'
            onClick={onDelete}>
            <DeleteIcon/>
          </IconButton>
        }
        {selectedItemsCounter === 0 &&
          <DropDownButton 
            title={t('appBar.dropDown')}>
            <MenuItem
              disabled={disableUploadOption}
              onClick={onUploadFile}>
              {t('appBar.uploadOption')}
            </MenuItem>
          </DropDownButton>
        }
      </Box>
    </Box>
  );
}
