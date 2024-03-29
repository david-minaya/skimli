/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';

const NotFound: NextPage = () => {

  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation('page404');

  return (
    <>
      <Head>
        <title>{t('tabTitle')}</title>
      </Head>
      <Box
        component='main'
        sx={{
          alignItems: 'center',
          backgroundColor: 'background.paper',
          display: 'flex',
          flexGrow: 1,
          py: '80px',
        }}
      >
        <Container maxWidth='lg'>
          <Typography align='center' variant={mobileDevice ? 'h4' : 'h1'}>
            {t('title')}
          </Typography>
          <Typography
            align='center'
            variant='subtitle2'
            sx={{ color: theme.palette.action.active, marginBottom: '48px' }}
          >
            {t('description')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '48px',
            }}
          >
            <Image
              src='/static/error404.png'
              alt='error404'
              width='637'
              height='365'
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <NextLink href='/' passHref>
              <Button component='a' variant='contained'>
                {t('button')}
              </Button>
            </NextLink>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NotFound;

export async function getStaticProps({ locale }) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['page404']))
    }
  };
}
