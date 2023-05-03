import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Asset } from '~/types/assets.type';
import { TimelineFrames } from '~/components/timeline-frames/timeline-frames.component';
import { TimelineThumb } from '~/components/timeline-thumb/timeline-thumb.component';
import { style } from './timeline.style';

interface Props {
  asset: Asset;
  currentTime: number;
  duration: number;
  onTimeChange: (time: number) => void;
}

export function Timeline(props: Props) {

  const {
    asset,
    currentTime,
    duration,
    onTimeChange
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [timelineLeft, setTimelineLeft] = useState(0.1);
  const [timelineWidth, setTimelineWidth] = useState(0.1);

  useEffect(() => {

    const onResize = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setTimelineLeft(rect.left);
        setTimelineWidth(rect.width);
      }
    }

    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, []);

  return (
    <Box 
      sx={style.container}
      ref={ref}>
      <TimelineFrames
        asset={asset}
        timelineWidth={timelineWidth}/>
      <TimelineThumb
        time={currentTime}
        duration={duration}
        timelineLeft={timelineLeft}
        timelineWidth={timelineWidth}
        onChange={onTimeChange}/>
    </Box>
  );
}
