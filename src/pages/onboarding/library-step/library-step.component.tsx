import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { style } from './library-step.style';

interface Props {
  show: boolean;
}

export function LibraryStep(props: Props) {

  const { show } = props;

  if (!show) return null;

  return (
    <Box sx={style.container}>
      <Box sx={style.content}>
        <Box sx={style.title}>Your Free account is ready</Box>
        <Link href='/'>
          <Button
            sx={style.button}
            variant='contained'>
            Take me to my library
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
