import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Close } from '@mui/icons-material';
import { InfoIcon } from '~/icons/infoIcon';
import { useGetCategories } from '~/graphqls/useGetCategories';
import { useConvertToClips } from '~/graphqls/useConvertToClips';
import { Asset } from '~/types/assets.type';
import { style } from './convert-to-clips-modal.style';

import { 
  Dialog, 
  DialogTitle, 
  IconButton, 
  DialogContent,
  Button, 
  Box,
  Tooltip,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';

interface Props {
  open: boolean;
  asset: Asset;
  onClose: () => void;
}

export function ConvertToClipsModal(props: Props) {

  const {
    open,
    asset,
    onClose
  } = props;

  const { t } = useTranslation('library');
  const categories = useGetCategories();
  const convertToClips = useConvertToClips();
  const [category, setCategory] = useState('');
  const [showError, setShowError] = useState(false);

  function handleChange(e: SelectChangeEvent<string>) {
    setCategory(e.target.value);
    setShowError(false);
  }

  async function handleSubmit() {

    if (category === '') {
      setShowError(true);
      return;
    }

    await convertToClips(asset.uuid, category);
    onClose();
  }

  function handleClose() {
    setCategory('');
    setShowError(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      sx={style.dialog}
      onClose={handleClose}>
      <DialogTitle sx={style.title}>
        {t('convertToClipsModal.title')}
        <IconButton 
          size='small'
          onClick={handleClose}>
          <Close/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={style.content}>
          <Box sx={style.assetTitle}>{asset.name}</Box>
          <Box sx={style.selectTitle}>
            {t('convertToClipsModal.selectTitle')}
            <Tooltip
              title={t('convertToClipsModal.tooltip')}
              componentsProps={{ tooltip: { sx: style.tooltip } }}
              placement='top-start'>
              <IconButton sx={style.iconButton}>
                <InfoIcon sx={style.icon}/>
              </IconButton>
            </Tooltip>
          </Box>
          <Select 
            sx={style.select} 
            required={true}
            value={category}
            onChange={handleChange}>
            {categories?.map(category => 
              <MenuItem 
                key={category.code}
                value={category.code}>
                {category.label}
              </MenuItem>
            )}
          </Select>
          {showError &&
            <Box sx={style.error}>{t('convertToClipsModal.error')}</Box>
          }
          <Button 
            sx={style.button}
            variant='contained'
            onClick={handleSubmit}>
            {t('convertToClipsModal.button')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
