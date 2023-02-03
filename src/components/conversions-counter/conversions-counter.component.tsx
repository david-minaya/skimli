import { Box, IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useGetConversions } from '~/graphqls/useGetConversions';
import { InfoIcon } from '~/icons/infoIcon';
import { style } from './conversions-counter.style';

interface Props {
  sx?: SxProps<Theme>;
}

export function ConversionsCounter(props: Props) {

  const conversions = useGetConversions();
  const { t } = useTranslation('components');

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
