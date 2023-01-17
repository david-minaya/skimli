/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { ThemeOptions } from "@mui/material";

export const baseThemeOptions: ThemeOptions = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        body: {
          height: '100vh',
          backgroundColor: 'white',
          color: '#333333'
        },
        "#__next": {
          height: "100%"
        }
      },
    },
  },
  direction: "ltr",
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'
  }
};
