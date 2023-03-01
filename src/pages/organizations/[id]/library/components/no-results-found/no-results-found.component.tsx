import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { style } from './no-results-found.style';

interface Props {
  show: boolean;
  search: string;
}

export function NoResultsFound(props: Props) {

  const {
    show,
    search
  } = props;

  const { t } = useTranslation('library');

  if (!show) return null;

  return (
    <Box sx={style.container}>
      <Box
        component='img'
        sx={style.image}
        src='/images/no-results-found.svg'/>
      <Box 
        sx={style.title}>
        {t('noResultsFound.description', { search })}
      </Box>
    </Box>
  );
}
