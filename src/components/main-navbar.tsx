/*
 * Copyright (c) 2021. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { AppBar, Box, Container, Toolbar } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import type { FC } from "react";

// TODO: This should be a left side app bar that is in a box which doesn't flex grow, position should be sticky
// Not sure if we need bottom border, etc.
// This sample is in line with what we need for the left side https://codesandbox.io/s/major-viewer-layout-2-forked-001t9?file=/demo.js
// Remove these comments once implemented.
export const MainNavbar: FC = () => {
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottomColor: "divider",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        color: "text.secondary",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <NextLink href="/" passHref>
            <a>
              <Image
                src="/static/secondary-logo.png"
                alt="me"
                objectFit="contain"
                width="150"
                height="40"
              />
            </a>
          </NextLink>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              alignItems: "center",
              display: {
                md: "flex",
                xs: "none",
              },
            }}
          ></Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
