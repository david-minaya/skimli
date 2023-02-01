import { Box, IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import { useGetConversions } from '~/graphqls/useGetConversions';
import { InfoIcon } from '~/icons/infoIcon';
import { style } from './conversions-counter.style';

interface Props {
  sx?: SxProps<Theme>;
}

export function ConversionsCounter(props: Props) {

  const conversions = useGetConversions();

  if (!conversions) {
    return null;
  }

  return (
    <Box sx={[style.container, props.sx as any]}>
      <Tooltip
        componentsProps={{ tooltip: { sx: style.tooltip } }}
        title={
          `You have a maximum of ${conversions?.total} conversions with your current plan. Upgrade to Skimli Pro to get unlimited conversions`
        }>
        <IconButton sx={style.iconButton}>
          <InfoIcon sx={style.icon}/>
        </IconButton>
      </Tooltip>
      {conversions?.counter}/{conversions?.total} Convercions
    </Box>
  );
}
