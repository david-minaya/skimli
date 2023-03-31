import { useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Clip } from '~/types/clips.type';
import { style } from './clip-timeline.style';
import { ClipTimelineFrame } from '../clip-timeline-frame/clip-timeline-frame.component';
import { ClipTimelineThumb } from '../clip-timeline-thumb/clip-timeline-thumb.component';

interface Props {
  clip: Clip;
  playbackId: string;
}

export function ClipTimeline(props: Props) {

  const { 
    clip,
    playbackId
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(0);

  useEffect(() => {

    const calcFrameWidth = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const frameWidth = rect.width / 20;
        setFrameWidth(frameWidth);
      }
    }

    calcFrameWidth();
    window.addEventListener('resize', calcFrameWidth);

    return () => {
      window.removeEventListener('resize', calcFrameWidth);
    }
  }, []);

  const frames = useMemo(() => {
    const frames: number[] = [];
    for (let i = clip.startTime; i <= clip.startTime + clip.duration; i += 30) {
      frames.push(i)
    }
    return frames;
  }, [clip]);

  return (
    <Box 
      sx={style.container}
      ref={ref}>
      <Box sx={style.frames}>
        {frames.map(frame =>
          <ClipTimelineFrame
            key={frame} 
            width={frameWidth}
            height={48}
            frame={frame}
            playbackId={playbackId}/>
        )}
      </Box>
      <ClipTimelineThumb
        clip={clip}
        clipTimelineElement={ref.current}
        width={frames.length * frameWidth}/>
    </Box>
  );
}
