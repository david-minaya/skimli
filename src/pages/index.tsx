/*
 * Copyright (c) 2021. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import type { NextPage } from "next";
import Head from "next/head";
import { Button, Container, Typography } from "@mui/material";
import { withMainLayout } from "../hocs/with-main-layout";
import { useUser } from "@auth0/nextjs-auth0/client";
import NextLink from "next/link";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

// TODO: replace temporary homepage with proper one
const Home: NextPage = () => {
  const { user, isLoading, error } = useUser();

  return (
    <>
      <Head>
        <title>Skimli | Webapp</title>
      </Head>
      <main>
        <Container maxWidth="lg">
          {error && <Typography>{error.message}</Typography>}
          {isLoading && <Typography>Loading ...</Typography>}
          {user && (
            <>
              <Typography variant="h6">Welcome {user?.email}</Typography>
              <Typography variant="h6">
                Email verified: {JSON.stringify(user?.email_verified)}
              </Typography>
              <Typography variant="h6">Organization: {user?.org_id}</Typography>
              <NextLink href={"/api/auth/logout"} passHref>
                <Button
                  component="a"
                  size="medium"
                  sx={{ ml: 2 }}
                  variant="contained"
                >
                  Logout
                </Button>
              </NextLink>
            </>
          )}
        </Container>
      </main>
    </>
  );
};

export default withMainLayout(Home);

export const getServerSideProps = withPageAuthRequired();
