import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Close } from '@mui/icons-material';
import { InfoIcon } from '~/icons/infoIcon';
import { useGetCategories } from '~/graphqls/useGetCategories';
import { useConvertToClips } from '~/graphqls/useConvertToClips';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { useUploadFiles } from '~/utils/UploadFilesProvider';
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
  SelectChangeEvent,
  InputBase
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
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const uploadFiles = useUploadFiles();
  const categories = useGetCategories();
  const convertToClips = useConvertToClips();
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<FileList>();
  const [disableButton, setDisableButton] = useState(false);
  const [showSelectCategoryError, setShowSelectCategoryError] = useState(false);
  const [showError, setShowError] = useState(false);

  useAsyncEffect(async () => {

    if (open && uploadFiles.completed) {
      uploadFiles.reset();
      await convert();
    }

    if (open && uploadFiles.failed) {
      setDisableButton(false);
    }
  }, [open, category, asset, uploadFiles.completed]);

  function handleChange(e: SelectChangeEvent<string>) {
    setCategory(e.target.value);
    setShowSelectCategoryError(false);
  }

  function handleInputFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files);
    }
  }

  async function handleSubmit() {

    if (category === '') {
      setShowSelectCategoryError(true);
      return;
    }

    if (!file) {
      setDisableButton(true);
      await convert();
      return;
    }

    setShowError(false);
    setDisableButton(true);
    uploadFiles.uploadMediaFiles(file, asset.uuid, 'hidden');
  }

  function handleClose() {
    setCategory('');
    setFile(undefined);
    setShowSelectCategoryError(false);
    setShowError(false);
    setDisableButton(false);
    uploadFiles.reset();
    onClose();
  }

  async function convert() {
    try {
      await convertToClips(asset.uuid, category);
      handleClose();
    } catch (err: any) {
      setShowError(true);
      setDisableButton(false);
    }
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
            {t('convertToClipsModal.selectCategory.title')}
            <Tooltip
              title={t('convertToClipsModal.selectCategory.tooltip')}
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
          {showSelectCategoryError &&
            <Box sx={style.selectCategoryError}>{t('convertToClipsModal.selectCategory.error')}</Box>
          }
          <Box sx={style.selectTitle}>
            {t('convertToClipsModal.uploadFile.title')}
            <Tooltip
              title={t('convertToClipsModal.uploadFile.tooltip')}
              componentsProps={{ tooltip: { sx: style.tooltip } }}
              placement='top-start'>
              <IconButton sx={style.iconButton}>
                <InfoIcon sx={style.icon}/>
              </IconButton>
            </Tooltip>
          </Box>
          <Box 
            sx={style.uploadFile}
            onClick={() => hiddenFileInputRef.current?.click()}>
            <Box sx={style.uploadFileValue}>{file?.[0]?.name || ''}</Box>
            <Box sx={style.uploadFileButton}>{t('convertToClipsModal.uploadFile.button')}</Box>
          </Box>
          {uploadFiles.inProgress &&
            <Box sx={style.uploadFileProgress}>{t('convertToClipsModal.uploadFile.progress')}</Box>
          }
          {uploadFiles.failed &&
            <Box sx={style.uploadFileError}>{t('convertToClipsModal.uploadFile.error')}</Box>
          }
          <Button 
            sx={style.button}
            disabled={disableButton}
            variant='contained'
            onClick={handleSubmit}>
            {t('convertToClipsModal.button')}
          </Button>
          {showError &&
            <Box sx={style.error}>{t('convertToClipsModal.error')}</Box>
          }
        </Box>
        <InputBase
          sx={style.hiddenFileInput}
          type='file'
          inputRef={hiddenFileInputRef}
          inputProps={{ accept: '.vtt' }}
          onChange={handleInputFileChange}/>
      </DialogContent>
    </Dialog>
  );
}
