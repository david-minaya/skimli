/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { createTheme as createMuiTheme, responsiveFontSizes } from '@mui/material/styles';
import { baseThemeOptions } from './base-theme-options';
import { lightThemeOptions } from './light-theme-options';

interface Neutral {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

declare module '@mui/material/styles' {

  interface Palette {
    neutral: Neutral;
  }

  interface PaletteOptions {
    neutral: Neutral;
  }
}

export const theme = responsiveFontSizes(createMuiTheme(baseThemeOptions, lightThemeOptions));
