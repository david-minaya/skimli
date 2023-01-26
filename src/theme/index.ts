import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {

  interface Palette {
    green: {
      main: string;
    }
    backgroundColor: {
      main: string;
    }
  }

  interface PaletteOptions {
    green: {
      main: string;
    },
    backgroundColor: {
      main: string;
    }
  }
}

export const theme = responsiveFontSizes(createTheme({
  direction: "ltr",
  palette: {
    mode: "light",
    primary: {
      main: "#fc4603",
      light: "#ff7b3c",
      dark: "#c00000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FD6B35",
      light: "#fff4f0",
      dark: "#feae91",
      contrastText: "rgba(0, 0, 0, 0.87)"
    },
    green: {
      main: '#14B8A6'
    },
    backgroundColor: {
      main: '#F6F6F6'
    }
  },
  typography: {
    fontFamily: '"Inter", sans-serif'
  },
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
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none'
        }
      }
    }
  }
}));
