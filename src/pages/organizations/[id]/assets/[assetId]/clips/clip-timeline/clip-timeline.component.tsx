import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Clip } from '~/types/clip.type';
import { style } from './clip-timeline.style';
import { ClipTimelineFrame } from '../clip-timeline-frame/clip-timeline-frame.component';
import { ClipTimelineThumb } from '../clip-timeline-thumb/clip-timeline-thumb.component';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';

interface Props {
  clip: Clip;
  playbackId: string;
}

export function ClipTimeline(props: Props) {

  const { 
    clip,
    playbackId
  } = props;

  const videoPlayer = useVideoPlayer();
  const ref = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const duration = clip.endTime - clip.startTime;

  useEffect(() => {

    const onResize = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setLeft(rect.left);
        setWidth(rect.width);
        setFrameWidth(rect.width / 20);
      }
    }

    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, []);

  const handleTimeChange = useCallback((time: number) => {
    videoPlayer.updateProgress(time + clip.startTime);
  }, [clip]);

  const frames = useMemo(() => {
    const frames: number[] = [];
    const frameDuration = duration / 20;
    for (let i = 0; i < 20; i += 1) {
      frames.push(clip.startTime + (i * frameDuration))
    }
    return frames;
  }, [clip, duration]);

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
        time={videoPlayer.currentTime - clip.startTime}
        duration={duration}
        timelineLeft={left}
        timelineWidth={width}
        onChange={handleTimeChange}/>
    </Box>
  );
}
