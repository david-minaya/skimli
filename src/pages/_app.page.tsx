/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import CssBaseline from '@mui/material/CssBaseline';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { basicLogger } from 'launchdarkly-js-client-sdk';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { Toaster } from 'react-hot-toast';
import { META_DESCRIPTION } from '~/constants';
import { theme } from '../theme';
import { createEmotionCache } from '../utils';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { useApollo } from '~/graphqls/useApollo';
import { appWithTranslation } from 'next-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { UploadVideoFilesProvider } from '~/providers/UploadVideoFilesProvider';
import { store } from '../store/store';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

// Client side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();

const App = (props) => {

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const apollo = useApollo();

  if (!apollo) return null;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Skimli | Webapp</title>
        <meta name='viewport' content='initial-scale=1,width=device-width'/>
        <meta name='theme-color' content='#FC4603'/>
        <meta name='description' content={META_DESCRIPTION}/>
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Toaster position='top-center'/>
          <ReduxProvider store={store}>
            <UserProvider>
              <ApolloProvider client={apollo}>
                <UploadVideoFilesProvider>
                  <Component {...pageProps}/>
                </UploadVideoFilesProvider>
              </ApolloProvider>
            </UserProvider>
          </ReduxProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

const i18n = appWithTranslation(App);

export default withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_ID ?? '',
  options: {
    logger: basicLogger({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
    }),
  },
})(i18n);
