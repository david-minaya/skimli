/*
 * Copyright (c) 2021. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import type { NextPage } from "next";
import Head from "next/head";
import { Container, Typography } from "@mui/material";
import { withMainLayout } from "../hocs/with-main-layout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Skimli</title>
      </Head>
      <main>
        <Container maxWidth="lg">
          <Typography variant="h1">Web App Starter</Typography>
        </Container>
      </main>
    </>
  );
};

export default withMainLayout(Home);
