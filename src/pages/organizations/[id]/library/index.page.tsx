import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '../protected-route/protected-route.component';
import { ConversionsCounter } from '~/components/conversions-counter/conversions-counter.component';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { UploadIcon } from '~/icons/uploadIcon';
import { useTranslation } from 'next-i18next';
import { style } from './index.style';

function Library() {

  const { user } = useUser();
  const { t } = useTranslation('library');

  return (
    <Main>
      <Head>
        <title>{t('tabTitle')}</title>
      </Head>
      <Box sx={style.container}>
        <Box sx={style.title}>{t('title')}</Box>
        <Container sx={style.content} maxWidth='md'>
          <Box sx={style.toolbar}>
            <Box>{t('toolbarTitle', { email: user?.email })}</Box>
            <ConversionsCounter/>
          </Box>
          <Box sx={style.card}>
            <Box>
              <Box sx={style.cardTitle}>{t('cardTitle')}</Box>
              <Box sx={style.cardDescription}>{t('cardDescription')}</Box>
            </Box>
            <OutlinedButton
              title={t('button')}
              icon={UploadIcon}/>
          </Box>
          <Box sx={style.emptyLibrary}>
            <Box
              sx={style.emptyLibraryImage}
              component='img'
              src='/images/empty-library.svg'/>
            <Box sx={style.emptyLibraryTitle}>{t('emptyLibraryTitle')}</Box>
            <Box sx={style.emptyLibraryDescription}>{t`emptyLibraryDescription`}</Box>
          </Box>
        </Container>
      </Box>
    </Main>
  );
};

export default function Page() {
  return (
    <ProtectedRoute>
      <Library/>
    </ProtectedRoute>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['library', 'components']))
    }
  }
}
