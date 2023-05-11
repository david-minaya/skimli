import { Box } from '@mui/material';
import { style } from './transcript-item.style';
import { formatSeconds } from '~/utils/formatSeconds';
import { mergeSx } from '~/utils/style';
import { useEffect, useRef } from 'react';

interface Props {
  time: number;
  cue: VTTCue;
  onClick?: (time: number) => void;
}

export function TranscriptItem(props: Props) {

  const {
    time, 
    cue,
    onClick
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const active = time >= cue.startTime && time <= cue.endTime;
  const isClicked = useRef<boolean>(false);

  useEffect(() => {
    if (active && !isClicked.current) {
      ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    isClicked.current = false;
  }, [active]);

  function handleClick() {
    isClicked.current = true;
    onClick?.(cue.startTime);
  }

  return (
    <Box 
      sx={mergeSx(style.container, active && style.active)}
      ref={ref}
      onClick={handleClick}>
      <Box sx={style.time}>{formatSeconds(cue.startTime)}</Box>
      <Box sx={style.text}>{cue.text}</Box>
    </Box>
  );
}
