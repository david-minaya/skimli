import { Box } from '@mui/material';
import { style } from './transcript-item.style';
import { formatSeconds } from '~/utils/formatSeconds';
import { mergeSx } from '~/utils/style';
import { useEffect, useRef } from 'react';

interface Props {
  time: number;
  cue: VTTCue;
}

export function TranscriptItem(props: Props) {

  const {
    time, 
    cue 
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const active = time >= cue.startTime && time <= cue.endTime;

  useEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [active]);

  return (
    <Box 
      sx={mergeSx(style.container, active && style.active)}
      ref={ref}>
      <Box sx={style.time}>{formatSeconds(cue.startTime)}</Box>
      <Box sx={style.text}>{cue.text}</Box>
    </Box>
  );
}
