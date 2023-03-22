import { Box } from '@mui/material';
import { style } from './aspect-ratio-item.style';

interface Props {
  image: string;
  title: string;
  description: string;
}

export function AspectRatioItem(props: Props) {

  const { 
    image,
    title,
    description
  } = props;

  return (
    <Box sx={style.container}>
      <Box 
        sx={style.image}
        component='img'
        src={image}/>
      <Box sx={style.title}>{title}</Box>
      <Box sx={style.description}>{description}</Box>
    </Box>
  );
}
