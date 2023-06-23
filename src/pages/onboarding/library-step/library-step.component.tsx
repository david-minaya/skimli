import { Box, Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { style } from './library-step.style';

interface Props {
  show: boolean;
}

export function LibraryStep(props: Props) {

  const { show } = props;
  const { t } = useTranslation('onboarding');

  if (!show) return null;

  return (
    <Box sx={style.container}>
      <Box sx={style.content}>
        <Box sx={style.title}>{t('library.title')}</Box>
        <Link href='/'>
          <Button
            sx={style.button}
            variant='contained'>
            {t('library.button')}
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
