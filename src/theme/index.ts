import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ErrorIcon } from '~/icons/errorIcon';
import { SuccessIcon } from '~/icons/successIcon';
import { WarningIcon } from '~/icons/warningIcon';

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
    info: {
      main: '#316AFE'
    },
    success: {
      main: '#14B8A6'
    },
    warning: {
      main: '#FFB020'
    },
    error: {
      main: '#D14343'
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
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          color: '#212121'
        },
        icon: {
          padding: '8px 0px',
          opacity: '1',
          '& svg': {
            width: '20px',
            height: '20px'
          }
        },
        standardInfo: ({ theme }) => ({
          backgroundColor: '#F3F6FF',
          border: `1px solid ${theme.palette.info.main}`,
          "& .MuiAlert-icon": {
            color: theme.palette.info.main
          }
        }),
        standardSuccess: ({ theme }) => ({
          backgroundColor: '#F1FBFA',
          border: `1px solid ${theme.palette.success.main}`,
          "& .MuiAlert-icon": {
            color: theme.palette.success.main
          }
        }),
        standardWarning: ({ theme }) => ({
          backgroundColor: '#FFFBF2',
          border: `1px solid ${theme.palette.warning.main}`,
          "& .MuiAlert-icon": {
            color: theme.palette.warning.main
          }
        }),
        standardError: ({ theme }) => ({
          backgroundColor: '#FDF4F4',
          border: `1px solid ${theme.palette.error.main}`,
          "& .MuiAlert-icon": {
            color: theme.palette.error.main
          }
        })
      },
      defaultProps: {
        iconMapping: {
          success: SuccessIcon({}),
          warning: WarningIcon({}),
          error: ErrorIcon({})
        } 
      }
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontWeight: 'bold'
        }
      }
    }
  }
}));
