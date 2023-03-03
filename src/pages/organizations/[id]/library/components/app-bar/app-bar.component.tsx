import { Box, IconButton } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Toast } from '~/components/toast/toast.component';
import { ClearSelectionIcon } from '~/icons/clearSelectionIcon';
import { DeleteIcon } from '~/icons/deleteIcon';
import { useAssets } from '~/store/assets.slice';
import { DropDownButton } from '../drop-down-button/drop-down-button.component';
import { SearchField } from '../search-field/search-field.component';
import { style } from './app-bar.style';

interface Props {
  onSearchChange: (value?: string) => void;
  onOpenFilePicker: () => void;
}

export function AppBar(props: Props) {

  const { 
    onSearchChange,
    onOpenFilePicker
  } = props;

  const { t } = useTranslation('library');
  const assetsStore = useAssets();
  const areAssetsSelected = assetsStore.areSelected();
  const selectedIds = assetsStore.getSelectedIds();
  const [openErrorToast, setOpenErrorToast] = useState(false);

  function handleUnselectAll() {
    assetsStore.unSelectAll();
  }

  async function handleDelete() {

    try {

      await assetsStore.deleteMany(selectedIds);
      await assetsStore.fetchAll();
    
    } catch (err: any) {

      await assetsStore.fetchAll();
      setOpenErrorToast(true);
      assetsStore.unSelectAll();
    }
  }

  return (
    <Box sx={style.appBar}>
      <Box sx={style.left}>
        {areAssetsSelected &&
          <Box sx={style.selectedContainer}>
            <IconButton 
              size='small'
              onClick={handleUnselectAll}>
              <ClearSelectionIcon/>
            </IconButton>
            <Box sx={style.selectedTitle}>
              {t('appBar.title')}
            </Box>
            <Box sx={style.selectedCounter}>
              {t('appBar.counter', { count: selectedIds.length})}
            </Box>
          </Box>
        }
        {!areAssetsSelected &&
          <Box sx={style.title}>{t('appBar.title')}</Box>
        }
      </Box>
      <Box sx={style.center}>
        <SearchField 
          onChange={onSearchChange}/>
      </Box>
      <Box sx={style.right}>
        {areAssetsSelected &&
          <IconButton 
            size='small'
            onClick={handleDelete}>
            <DeleteIcon/>
          </IconButton>
        }
        {!areAssetsSelected &&
          <DropDownButton
            onUploadFile={onOpenFilePicker}/>
        }
      </Box>
      <Toast
        open={openErrorToast}
        severity='error'
        description={t('appBar.errorToast')}
        onClose={() => setOpenErrorToast(false)}/>
    </Box>
  );
}
