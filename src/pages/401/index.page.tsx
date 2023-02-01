/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { NextPage } from "next";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import NextLink from "next/link";
import Image from "next/image";

const AuthorizationRequired: NextPage = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Head>
        <title>Error: Authorization Required</title>
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
          <Typography align="center" variant={mobileDevice ? "h4" : "h2"} sx={{ fontWeight: 'bold' }}>
            “Hold up!” You are lost
          </Typography>
          <Typography align="center" variant="subtitle2" sx={{ color: theme.palette.action.active, marginBottom: '48px' }}>
            Error 401: No authorization found. You either tried some shady route or you came here by mistake.
          </Typography>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: '48px'
          }}>
            <Image src="/static/error401.png" alt="error401" width="424px" height="663px" />
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

export default AuthorizationRequired;
