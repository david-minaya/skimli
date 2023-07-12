import Link from 'next/link';
import {useState} from 'react';
import {useTranslation} from 'next-i18next';
import {Box} from '@mui/material';
import {useUser} from '@auth0/nextjs-auth0/client';
import {HomeIcon} from '~/icons/homeIcon';
import {Profile} from '../profile/profile.component';
import {style} from './nav-bar.style';
import {useAccount} from '~/store/account.slice';
import {HelpMenuIcon} from '~/icons/helpMenuIcon';
import {HelpMenu} from '../help-menu/help-menu.component';
import {NavBarItem} from '../nav-bar-item/nav-bar-item.component';
import {MediaIcon} from '~/icons/mediaIcon';
import {IntegrationsIcon} from '~/icons/integrationsIcon';

export function NavBar() {

  const accountStore = useAccount();
  const account = accountStore.get();
  const {t} = useTranslation('components');
  const {user} = useUser();
  const [profileAnchor, setProfileAnchor] = useState<HTMLDivElement | null>(null);
  const [helpMenuAnchor, setHelpMenuAnchor] = useState<HTMLDivElement | null>(null);

  return (
    <Box sx={style.container}>
      <Box sx={style.top}>
        <Link href={`/organizations/${account?.org}/library`}>
          <Box
            sx={style.logo}
            component='img'
            src='/logo.svg'/>
        </Link>
        <NavBarItem
          tooltip={t('navBar.options.home')}
          icon={<HomeIcon/>}
          href={`/organizations/${account?.org}/library`}/>
        <NavBarItem
          tooltip={t('navBar.options.media')}
          icon={<MediaIcon/>}
          href={`/organizations/${account?.org}/media`}/>
        <NavBarItem
          tooltip={t('navBar.options.integrations')}
          icon={<IntegrationsIcon/>}
          href={`/organizations/${account?.org}/integrations`}/>
      </Box>
      <Box sx={style.bottom}>
        <NavBarItem
          tooltip={t('navBar.options.help')}
          icon={<HelpMenuIcon/>}
          onClick={e => setHelpMenuAnchor(e.currentTarget)}/>
        <NavBarItem
          tooltip={t('navBar.options.profile')}
          onClick={e => setProfileAnchor(e.currentTarget)}
          icon={
            <Box
              sx={style.profileImage}
              component='img'
              src={user?.picture || ''}/>
          }/>
      </Box>
      <HelpMenu
        anchor={helpMenuAnchor}
        onClose={() => setHelpMenuAnchor(null)}/>
      <Profile
        anchor={profileAnchor}
        onClose={() => setProfileAnchor(null)}/>
    </Box>
  );
}
