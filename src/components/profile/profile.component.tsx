import Link from 'next/link';
import { Box, Popover } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useUser } from '@auth0/nextjs-auth0/client';
import { style } from './profile.style';
import { useAccount } from '~/store/account.slice';

interface Props {
  anchor: Element | null;
  onClose: () => void;
}

export function Profile(props: Props) {

  const { 
    anchor,
    onClose
  } = props;

  const { t } = useTranslation('components');
  const { user } = useUser();
  const accountStore = useAccount();
  const account = accountStore.get();

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
          <Box sx={style.option}>{t('profile.options.profile')}</Box>
        </Link>
        <Link href={`/organizations/${account?.org}/billing/plan`}>
          <Box sx={style.option}>{t('profile.options.billing')}</Box>
        </Link>
        <Box
          component='a'
          href='/api/auth/logout'
          sx={style.option}>{t('profile.options.logout')}</Box>
      </Box>
    </Popover>
  );
}
