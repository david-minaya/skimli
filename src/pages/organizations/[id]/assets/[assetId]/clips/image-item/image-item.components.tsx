import { Box } from '@mui/material';
import { ImageMedia } from '~/types/imageMedia.type';
import { style } from './image-item.style';

interface Props {
  imageAsset: ImageMedia;
}

export function ImageItem(props: Props) {

  const { imageAsset } = props;

  return (
    <Box sx={style.container}>
      <Box
        component='img'
        sx={style.image}
        src={imageAsset.details.cdnUrl}/>
      <Box sx={style.details}>
        <Box sx={style.title}>{imageAsset.name}</Box>
      </Box>
    </Box>
  );
}
