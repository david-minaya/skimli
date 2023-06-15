import { Box } from '@mui/system';
import { style } from './drop-area.style';

interface Props {
  show: boolean;
  description: string;
  onHide: () => void;
}

export function DropArea(props: Props) {

  const {
    show,
    description,
    onHide
  } = props;

  if (!show) {
    return null;
  }

  return (
    <Box
      sx={style.container}
      onDragLeave={onHide}>
      <Box sx={style.content}>
        <Box
          sx={style.image}
          component='img'
          src='/images/upload-file.svg'/>
        <Box sx={style.title}>
          {description}
        </Box>
      </Box>
    </Box>
  );
}
