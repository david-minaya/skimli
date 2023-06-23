import { Box, IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { InfoIcon } from '~/icons/infoIcon';
import { useConversions } from '~/store/conversions.slice';
import { useEffect } from 'react';
import { style } from './conversions-counter.style';

interface Props {
  sx?: SxProps<Theme>;
}

export function ConversionsCounter(props: Props) {

  const Conversions = useConversions();
  const conversions = Conversions.get();
  const { t } = useTranslation('components');

  useEffect(() => {
    Conversions.fetch();
  }, []);

  if (!conversions) {
    return null;
  }

  return (
    <Box sx={[style.container, props.sx as any]}>
      <Tooltip
        componentsProps={{ tooltip: { sx: style.tooltip } }}
        title={t('conversions.tooltip', { total: conversions.total })}>
        <IconButton sx={style.iconButton}>
          <InfoIcon sx={style.icon}/>
        </IconButton>
      </Tooltip>
      {t('conversions.title', { counter: conversions.counter, total: conversions.total })}
    </Box>
  );
}
