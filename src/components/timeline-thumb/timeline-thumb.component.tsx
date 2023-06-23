import { Box } from '@mui/material';
import { useState, Fragment } from 'react';
import { ClipTimelineThumbIcon } from '~/icons/clipTimelineThumbIcon';
import { formatSeconds } from '~/utils/formatSeconds';
import { style } from './timeline-thumb.style';
import { Drag } from '~/components/drag/drag.component';
import { mergeSx } from '~/utils/style';
import { toFinite } from '~/utils/toFinite';

interface Props {
  time: number;
  startTime?: number;
  endTime?: number;
  duration: number;
  timelineLeft: number;
  timelineWidth: number;
  onChange: (time: number) => void;
}

export function TimelineThumb(props: Props) {

  const {
    time,
    startTime = 0,
    duration,
    endTime = duration,
    timelineLeft,
    timelineWidth,
    onChange
  } = props;

  const [focus, setFocus] = useState(false);

  const left = toFinite((timelineWidth / duration) * startTime);
  const width = toFinite((timelineWidth / duration) * (endTime - startTime));
  const leftThumb = toFinite((timelineWidth / duration) * (Math.min(Math.max(startTime, time), endTime) - startTime));

  return (
    <Fragment>
      <Drag
        sx={mergeSx(style.container, { left, width })}
        draggable={false}
        time={time}
        startTime={startTime}
        endTime={endTime}
        duration={duration}
        left={timelineLeft}
        width={timelineWidth}
        onChange={onChange}>
        <Box
          tabIndex={0}
          sx={style.thumb}
          style={{ left: leftThumb }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}>
          {!focus && <ClipTimelineThumbIcon sx={style.thumbIcon}/>}
          {focus &&
            <Fragment>
              <Box sx={style.thumbTimecode}>{formatSeconds(time - startTime, true)}</Box>
              <Box sx={style.thumbTimecodeLine}/>
            </Fragment>
          }
        </Box>
      </Drag>
    </Fragment>
  );
}
