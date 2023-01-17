import { useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { HomeIcon } from '~/icons/homeIcon';
import { Profile } from '../profile/profile.component';
import { style } from './nav-bar.style';
import Link from 'next/link';

export function NavBar() {

  const { user } = useUser();

  const [profileAnchor, setProfileAnchor] = useState<HTMLDivElement | null>(null);

  return (
    <Box sx={style.container}>
      <Box sx={style.options}>
        <Link href='/'>
          <Box
            sx={style.logo} 
            component='img' 
            src='logo.svg'/>
        </Link>
        <Link href='/'>
          <Box sx={style.option}>
            <HomeIcon sx={style.optionIcon}/>
          </Box>
        </Link>
      </Box>
      <Box sx={style.options}>
        <Tooltip
          componentsProps={{ tooltip: { sx: style.tooltip } }}
          title='My Profile'
          placement='right'>
          <Box 
            sx={style.option}
            onClick={e => setProfileAnchor(e.currentTarget)}>
            <Box
              sx={style.profileImage} 
              component='img' 
              src={user?.picture || ''}/>
          </Box>
        </Tooltip>
        <Profile 
          anchor={profileAnchor}
          onClose={() => setProfileAnchor(null)}/>
      </Box>
    </Box>
  );
}
