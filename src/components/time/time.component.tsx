import { Box } from '@mui/material';
import { formatSeconds } from '~/utils/formatSeconds';
import { SxProps, Theme } from '@mui/system';
import { mergeSx } from '~/utils/style';
import { style } from './time.style';

interface Props {
  sx?: SxProps<Theme>;
  time: number;
  duration: number;
}

export function Time(props: Props) {

  const {
    sx,
    time,
    duration
  } = props;

  return (
    <Box sx={mergeSx(style.time, sx)}>
      {formatSeconds(time)} / {formatSeconds(duration)}
    </Box>
  );
}
