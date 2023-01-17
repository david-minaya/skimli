/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { ThemeOptions } from "@mui/material";

// Colors

const neutral = {
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DB",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
};

const background = {
  default: "#FAFAFA",
  paper: "#FFFFFF",
};

const primary = {
  main: "#fc4603",
  light: "#ff7b3c",
  dark: "#c00000",
  contrastText: "#ffffff",
};

const secondary = {
  main: "#FD6B35",
  light: "#fff4f0",
  dark: "#feae91",
  contrastText: "rgba(0, 0, 0, 0.87)",
};

const success = {
  main: "#4caf50",
  light: "#81c784",
  dark: "#388e3c",
  contrastText: "rgba(0, 0, 0, 0.87)",
};

const info = {
  main: "#2196F3",
  light: "#64B5F6",
  dark: "#1976D2",
  contrastText: "#FFFFFF",
};

const warning = {
  main: "#FF9800",
  light: "#FFB74D",
  dark: "#F57C00",
  contrastText: "rgba(0, 0, 0, 0.87)",
};

const error = {
  main: "#F44336",
  light: "#E57373",
  dark: "#D32F2F",
  contrastText: "#FFFFFF",
};

const text = {
  primary: "rgba(0, 0, 0, 0.87)",
  secondary: "rgba(0, 0, 0, 0.54)",
  disabled: "#00000061",
};

export const lightThemeOptions: ThemeOptions = {
  palette: {
    action: {
      active: neutral[500],
      focus: "rgba(55, 65, 81, 0.12)",
      hover: "rgba(55, 65, 81, 0.04)",
      selected: "rgba(55, 65, 81, 0.08)",
      disabledBackground: "rgba(55, 65, 81, 0.12)",
      disabled: "rgba(55, 65, 81, 0.26)",
    },
    background,
    error,
    info,
    mode: "light",
    neutral,
    primary,
    secondary,
    success,
    text,
    warning,
  }
};
