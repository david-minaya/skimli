import { Box } from '@mui/material';
import { style } from './clip-duration.style';
import { formatSeconds } from '~/utils/formatSeconds';
import { useTranslation } from 'react-i18next';

interface Props {
  duration: number;
}

export function ClipDuration(props: Props) {

  const { duration } = props;
  const { t } = useTranslation('components');

  return (
    <Box sx={style.container}>
      <Box component='span'>{t('clipDuration')} </Box>
      <Box component='span' sx={style.duration}>{formatSeconds(duration)}</Box>
    </Box>
  );
}
