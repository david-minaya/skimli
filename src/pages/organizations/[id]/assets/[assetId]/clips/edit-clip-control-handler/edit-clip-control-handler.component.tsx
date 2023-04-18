import React, { cloneElement, useState } from 'react';
import { Box } from '@mui/material';
import { style } from './edit-clip-control-handler.style';
import { formatSeconds } from '~/utils/formatSeconds';
import { mergeSx } from '~/utils/style';
import { Drag } from '~/components/drag/drag.component';

interface Props {
  sx?: typeof style['container'];
  icon: JSX.Element;
  time: number;
  duration: number;
  timelineLeft: number;
  timelineWidth: number;
  onStart: () => void;
  onChange: (time: number) => void;
  onEnd: () => void;
}

export function EditClipControlHandler(props: Props) {

  const {
    sx,
    icon,
    time,
    duration,
    timelineLeft,
    timelineWidth,
    onStart,
    onChange,
    onEnd
  } = props;

  const [focus, setFocus] = useState(false);

  return (
    <Drag
      sx={mergeSx(style.container, sx)}
      draggable={false}
      duration={duration}
      left={timelineLeft}
      width={timelineWidth}
      onStart={onStart}
      onChange={onChange}
      onEnd={onEnd}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}>
      {cloneElement(icon, { sx: style.icon })}
      {focus && <Box sx={style.time}>{formatSeconds(time, true)}</Box>}
    </Drag>
  );
}
