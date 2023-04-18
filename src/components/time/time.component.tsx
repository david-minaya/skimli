import { Box } from '@mui/material';
import { formatSeconds } from '~/utils/formatSeconds';
import { style } from './time.style';

interface Props {
  time: number;
  duration: number;
}

export function Time(props: Props) {

  const {
    time,
    duration
  } = props;

  return (
    <Box sx={style.time}>
      {formatSeconds(time)} / {formatSeconds(duration)}
    </Box>
  );
}
