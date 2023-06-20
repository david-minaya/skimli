import { ChangeEvent, useRef } from 'react';
import { Box, InputBase, Typography } from '@mui/material';
import { useUploadMediaFiles } from '~/providers/UploadMediaFilesProvider';
import { style } from './sidebar-upload-file.style';
import { mergeSx } from '~/utils/style';

interface Props {
  sx?: typeof style['container'];
  show: boolean;
  assetId?: string;
  accept?: string;
  multiple?: boolean;
  title: string;
  description: string;
  link: string;
  footer: string;
}

export function SidebarUploadFile(props: Props) {

  const {
    sx,
    show,
    assetId,
    accept,
    multiple = false,
    title,
    description,
    link: linkText,
    footer
  } = props;

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const uploadFiles = useUploadMediaFiles();

  function handleInputFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      uploadFiles.upload(event.target.files, assetId);
    }
  }

  const link = (
    <Box 
      component='span' 
      sx={style.link} 
      onClick={() => hiddenFileInputRef.current?.click()}>
      {linkText}
    </Box>
  );

  const [part1, part2] = description.split('<link/>');

  if (!show) return null;

  return (
    <Box sx={mergeSx(style.container, sx)}>
      <Box sx={style.image} component='img' src='/images/upload-file.svg'/>
      <Typography sx={style.text} paragraph variant='body2'>{title}</Typography>
      <Typography sx={style.text} paragraph variant='body2'>{part1} {link}{part2}</Typography>
      <Typography sx={style.text} paragraph variant='body2'>{footer}</Typography>
      <InputBase
        sx={style.hiddenFileInput}
        type='file'
        inputRef={hiddenFileInputRef}
        inputProps={{ accept, multiple }}
        onChange={handleInputFileChange}/>
    </Box>
  );
}
