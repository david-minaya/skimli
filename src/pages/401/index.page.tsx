/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { NextPage } from 'next';
import { useTheme } from '@mui/material/styles';
import Head from 'next/head';
import NextLink from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';

const AuthorizationRequired: NextPage = () => {

  const { t } = useTranslation('page401');
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

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
          <Typography align='center' variant={mobileDevice ? 'h4' : 'h2'} sx={{ fontWeight: 'bold' }}>
            {t('title')}
          </Typography>
          <Typography align='center' variant='subtitle2' sx={{ color: theme.palette.action.active, marginBottom: '48px' }}>
            {t('description')}
          </Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '48px'
          }}>
            <Image src='/static/error401.png' alt='error401' width='424' height='663'/>
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

export default AuthorizationRequired;

export async function getStaticProps({ locale }) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['page401']))
    }
  };
}
