import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { style } from './drop-area.style';

interface Props {
  show: boolean;
  onHide: () => void;
}

export function DropArea(props: Props) {

  const {
    show,
    onHide
  } = props;

  const { t } = useTranslation('library');

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
          {t('dropAreaTitle')}
        </Box>
      </Box>
    </Box>
  );
}
