/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { ApolloProvider } from "@apollo/client";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { basicLogger } from "launchdarkly-js-client-sdk";
import { withLDProvider } from "launchdarkly-react-client-sdk";
import Head from "next/head";
import Router from "next/router";
import nProgress from "nprogress";
import { Toaster } from "react-hot-toast";
import { META_DESCRIPTION, META_KEYWORDS } from "~/constants";
import { useApollo } from "~/graphqls";
import "../i18n";
import { createTheme } from "../theme";
import { createEmotionCache } from "../utils";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

// Client side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();

const WebApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Skimli | The Smartest and Fastest Way to Clip Videos</title>
        <meta name="viewport" content="initial-scale=1,width=device-width" />
        <meta name="theme-color" content="#FC4603" />
        <meta name="description" content={META_DESCRIPTION} />
        <meta name="keywords" content={META_KEYWORDS.join(",")} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@skimlico" />
        <meta
          name="twitter:title"
          content="Skimli | The Smartest and Fastest Way to Clip Videos"
        />
        <meta name="twitter:creator" content="@skimlico" />
        <meta
          name="twitter:description"
          content="Skimli uses the power of AI and machine learning to create clips of your most important scenes."
        />
        <meta
          name="twitter:image"
          content="https://images.ctfassets.net/efokgeev7zew/5YKfqIZAMTGcKVWTSuBwyL/a83f1a499abb9e7d4363221961a8ca66/skimli-logo-card.png"
        />
        <meta property="og:url" content="sbx.skimli.co" />
        <meta property="og:type" content="webapp" />
        <meta
          property="og:title"
          content="Skimli | The Smartest and Fastest Way to Clip Videos"
        />
        <meta
          property="og:description"
          content="Skimli uses the power of AI and machine learning to create clips of your most important scenes."
        />
        <meta
          property="og:image"
          content="https://images.ctfassets.net/efokgeev7zew/5YKfqIZAMTGcKVWTSuBwyL/a83f1a499abb9e7d4363221961a8ca66/skimli-logo-card.png"
        />
        <meta property="og:site_name" content="Skimli" />
        <meta property="og:locale" content="en_US" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider
          theme={createTheme({
            direction: "ltr",
            responsiveFontSizes: true,
            mode: "light",
          })}
        >
          <CssBaseline />
          <Toaster position="top-center" />
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_ID ?? "",
  options: {
    logger: basicLogger({
      level: process.env.NODE_ENV === "production" ? "error" : "info",
    }),
  },
})(WebApp);
