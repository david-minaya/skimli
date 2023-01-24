import { Box, CircularProgress } from '@mui/material';
import { style } from './loading.style';

export function Loading() {
  return (
    <Box sx={style.container}>
      <CircularProgress 
        size={80} 
        thickness={2.5}/>
    </Box>
  );
}
