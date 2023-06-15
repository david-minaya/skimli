import { Box } from '@mui/material';
import { style } from './no-results-found.style';

interface Props {
  show: boolean;
  image: string;
  description: string;
}

export function NoResultsFound(props: Props) {

  const {
    show,
    image,
    description
  } = props;

  if (!show) return null;

  return (
    <Box sx={style.container}>
      <Box
        component='img'
        sx={style.image}
        src={image}/>
      <Box 
        sx={style.title}>
        {description}
      </Box>
    </Box>
  );
}
