import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Popover } from '@mui/material';
import { style } from './profile.style';

interface Props {
  anchor: Element | null;
  onClose: () => void;
}

export function Profile(props: Props) {

  const { 
    anchor,
    onClose
  } = props;

  const { user } = useUser();

  return (
    <Popover
      elevation={2}
      sx={style.container}
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}>
      <Box sx={style.header}>
        <Box
          sx={style.image} 
          component='img' 
          src={user?.picture || ''}/>
        <Box>
          <Box sx={style.name}>{user?.nickname}</Box>
          <Box sx={style.email}>{user?.email}</Box>
        </Box>
      </Box>
      <Box sx={style.divider}/>
      <Box 
        sx={style.options}
        onClick={onClose}>
        <Link href='/profile'>
          <Box sx={style.option}>My Profile</Box>
        </Link>
        <Box
          component='a'
          href='/api/auth/logout'
          sx={style.option}>Logout</Box>
      </Box>
    </Popover>
  );
}
