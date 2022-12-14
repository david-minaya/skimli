/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { useEffect } from "react";
import type { NextPage } from "next";
import NextLink from "next/link";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

const NotFound: NextPage = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Head>
        <title>Error: Not Found | Skimli</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          backgroundColor: "background.paper",
          display: "flex",
          flexGrow: 1,
          py: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Typography align="center" variant={mobileDevice ? "h4" : "h1"}>
            “Oh no!” Looks like somethings missing
          </Typography>
          <Typography
            align="center"
            variant="subtitle2"
            sx={{ color: theme.palette.action.active, marginBottom: "48px" }}
          >
            Error 404: Page missing. We searched everywhere but couldnt find
            what you’re looking for. Try retracing your steps.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "48px",
            }}
          >
            <Image
              src="/static/error404.png"
              alt="error404"
              width="637px"
              height="365px"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <NextLink href="/" passHref>
              <Button component="a" variant="contained">
                Back to Home
              </Button>
            </NextLink>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NotFound;
