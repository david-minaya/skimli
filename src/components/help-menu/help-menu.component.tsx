/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */
import {Box, Link, Popover} from '@mui/material';
import {useTranslation} from 'next-i18next';
import {style} from './help-menu.style';
import {OpenInNewRounded} from '@mui/icons-material';


interface Props {
    anchor: Element | null;
    onClose: () => void;
}

export function HelpMenu(props: Props) {

  const {
    anchor,
    onClose
  } = props;

  const {t} = useTranslation('components');

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
      <Box
        sx={style.options}
        onClick={onClose}>
        <Link
          sx={style.link}
          target='_blank'
          href={`${process.env.NEXT_PUBLIC_WEB_SITE_DOMAIN}/resources/support`}>
          <Box>{t('helpMenu.options.supportCenterLink')}</Box>
          <OpenInNewRounded sx={style.linkIcon}/>
        </Link>
        <Link
          sx={style.link}
          target='_blank'
          href={`${process.env.NEXT_PUBLIC_WEB_SITE_DOMAIN}/contact-us`}>
          <Box>{t('helpMenu.options.contactSupportLink')}</Box>
          <OpenInNewRounded sx={style.linkIcon}/>
        </Link>
      </Box>
    </Popover>
  );
}
