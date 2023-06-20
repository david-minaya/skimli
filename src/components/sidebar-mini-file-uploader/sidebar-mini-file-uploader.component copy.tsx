import { ChangeEvent, useRef } from 'react';
import { Box, InputBase, Typography } from '@mui/material';
import { useUploadMediaFiles } from '~/providers/UploadMediaFilesProvider';
import { mergeSx } from '~/utils/style';
import { style } from './sidebar-mini-file-uploader.style';

interface Props {
  sx?: typeof style['container'];
  show: boolean;
  assetId?: string;
  title: string;
  accept?: string;
  multiple?: boolean;
}

export function SidebarMiniFileUploader(props: Props) {

  const { 
    sx, 
    show,
    assetId,
    title,
    accept,
    multiple = false
  } = props;

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const uploadFiles = useUploadMediaFiles();

  function handleInputFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      uploadFiles.upload(event.target.files, assetId);
    }
  }

  if (!show) return null;

  return (
    <Box 
      sx={mergeSx(style.container, sx)}
      onClick={() => hiddenFileInputRef.current?.click()}>
      <Box sx={style.image} component='img' src='/images/upload-file.svg'/>
      <Typography sx={style.title} paragraph variant='body2'>{title}</Typography>
      <InputBase
        sx={style.hiddenFileInput}
        type='file'
        inputRef={hiddenFileInputRef}
        inputProps={{ accept, multiple }}
        onChange={handleInputFileChange}/>
    </Box>
  );
}
