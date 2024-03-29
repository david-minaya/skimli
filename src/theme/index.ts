import { Inter } from 'next/font/google';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ErrorIcon } from '~/icons/errorIcon';
import { SuccessIcon } from '~/icons/successIcon';
import { WarningIcon } from '~/icons/warningIcon';
import { ChevronDownIcon } from '~/icons/chevronDownIcon';

const inter = Inter({ subsets: ['latin'] });

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
  direction: 'ltr',
  palette: {
    mode: 'light',
    primary: {
      main: '#fc4603',
      light: '#ff7b3c',
      dark: '#c00000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FD6B35',
      light: '#fff4f0',
      dark: '#feae91',
      contrastText: 'rgba(0, 0, 0, 0.87)'
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
    fontFamily: inter.style.fontFamily
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          '&::-webkit-scrollbar': {
            width: '20px'
          },
          '&::-webkit-scrollbar-thumb': {
            minHeight: '24px',
            backgroundColor: '#D9D9D9',
            borderRadius: '10px',
            border: '4px solid transparent',
            backgroundClip: 'padding-box'
          },
          '&::-webkit-scrollbar-button:single-button:start': {
            backgroundImage: 'url("/images/scrollbar-up-arrow.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            border: '4px solid transparent',
            backgroundClip: 'padding-box'
          },
          '&::-webkit-scrollbar-button:single-button:end': {
            backgroundImage: 'url("/images/scrollbar-down-arrow.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            border: '4px solid transparent',
            backgroundClip: 'padding-box'
          }
        },
        body: {
          height: '100vh',
          backgroundColor: 'white',
          color: '#333333'
        },
        '#__next': {
          height: '100%'
        },
        a: {
          textDecoration: 'none'
        }
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          minHeight: '32px',
          textTransform: 'none',
          fontSize: '12px',
          paddingTop: '4px',
          paddingBottom: '4px',
          borderRadius: '8px',
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
          '& .MuiAlert-icon': {
            color: theme.palette.info.main
          }
        }),
        standardSuccess: ({ theme }) => ({
          backgroundColor: '#F1FBFA',
          border: `1px solid ${theme.palette.success.main}`,
          '& .MuiAlert-icon': {
            color: theme.palette.success.main
          }
        }),
        standardWarning: ({ theme }) => ({
          backgroundColor: '#FFFBF2',
          border: `1px solid ${theme.palette.warning.main}`,
          '& .MuiAlert-icon': {
            color: theme.palette.warning.main
          }
        }),
        standardError: ({ theme }) => ({
          backgroundColor: '#FDF4F4',
          border: `1px solid ${theme.palette.error.main}`,
          '& .MuiAlert-icon': {
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
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: '1px solid #D1D5DB',
          '&.MuiPaper-elevation': {
            borderRadius: '8px',
            boxShadow: '0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)'
          }
        }
      },
      defaultProps: {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minWidth: '180px',
          color: 'black',
          fontSize: '14px',
          opacity: '1',
          ':not(:last-of-type)': {
            borderBottom: '1px solid #E6E8F0',
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '15px',
          borderRadius: '8px',
          borderColor: '#CCCCCC',
        },
        select: {
          padding: '8px 32px 6px 12px'
        },
        icon: {
          padding: '2px'
        }
      } as any,
      defaultProps: {
        IconComponent: ChevronDownIcon
      }
    }
  },
}));
