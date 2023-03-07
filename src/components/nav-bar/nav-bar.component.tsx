import NextLink from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Box, styled, Tooltip } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { HomeIcon } from '~/icons/homeIcon';
import { Profile } from '../profile/profile.component';
import { style } from './nav-bar.style';
import { useAccount } from '~/store/account.slice';

const Link = styled(NextLink)``;

export function NavBar() {

  const accountStore = useAccount();
  const account = accountStore.get();
  const { t } = useTranslation('components');
  const { user } = useUser();
  const [profileAnchor, setProfileAnchor] = useState<HTMLDivElement | null>(null);

  return (
    <Box sx={style.container}>
      <Box sx={style.options}>
        <Link href={`/organizations/${account?.org}/library`}>
          <Box
            sx={style.logo} 
            component='img' 
            src='/logo.svg'/>
        </Link>
        <Link
          sx={style.linkOption}
          href={`/organizations/${account?.org}/library`}>
          <Box sx={style.option}>
            <HomeIcon sx={style.optionIcon}/>
          </Box>
        </Link>
      </Box>
      <Box sx={style.options}>
        <Tooltip
          componentsProps={{ tooltip: { sx: style.tooltip } }}
          title={t('navBar.options.profile.tooltip')}
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
