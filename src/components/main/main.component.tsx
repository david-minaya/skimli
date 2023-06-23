import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { NavBar } from '../nav-bar/nav-bar.component';
import { style } from './main.style';

interface Props {
  children: ReactNode;
}

export function Main({ children }: Props) {
  return (
    <Box sx={style.container}>
      <NavBar/>
      <Box sx={style.content}>
        {children}
      </Box>
    </Box>
  );
}
