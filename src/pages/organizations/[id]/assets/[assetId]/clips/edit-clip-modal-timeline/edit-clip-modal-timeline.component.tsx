import { useEffect, useRef, useState, MouseEvent } from 'react';
import { Box } from '@mui/material';
import { Asset } from '~/types/assets.type';
import { EditClipControlHandler } from '../edit-clip-control-handler/edit-clip-control-handler.component';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { formatSeconds } from '~/utils/formatSeconds';
import { round } from '~/utils/round';
import { TimelineFrames } from '~/components/timeline-frames/timeline-frames.component';
import { TimelineThumb } from '~/components/timeline-thumb/timeline-thumb.component';
import { toFinite } from '~/utils/toFinite';
import { style } from './edit-clip-modal-timeline.style';

interface Props {
  asset: Asset;
  currentTime: number;
  startTime: number;
  endTime: number;
  duration: number;
  onCurrentTimeChange: (time: number) => void;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  onStartEndTimeChange: (start: number, end: number) => void;
  onPreview: () => void;
  onPreviewEnd: () => void;
}

export function EditClipModalTimeline(props: Props) {

  const {
    asset,
    currentTime,
    startTime,
    endTime,
    duration,
    onCurrentTimeChange,
    onStartTimeChange,
    onEndTimeChange,
    onStartEndTimeChange,
    onPreview,
    onPreviewEnd
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [timelineLeft, setTimelineLeft] = useState(0.1);
  const [timelineWidth, setTimelineWidth] = useState(0.1);
  const [showSkipThumb, setShowSkipThumb] = useState(false);
  const [skipThumbPosition, setSkipThumbPosition] = useState(0.1);

  const controlLeft = toFinite((timelineWidth / duration) * startTime);
  const controlWidth = toFinite((timelineWidth / duration) * (endTime - startTime));
  const skipThumbTime = toFinite((duration / timelineWidth) * skipThumbPosition);

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

  function handleFramesMouseMove(event: MouseEvent<HTMLDivElement>) {
    setSkipThumbPosition(event.pageX - timelineLeft);
  }

  function handleFramesClick(event: MouseEvent<HTMLDivElement>) {

    const x = event.pageX - timelineLeft;
    const time = round((duration / timelineWidth) * x, 3);
    const clipDuration = endTime - startTime;

    let start = time;
    let end = start + clipDuration;

    if (end > duration) {
      start = round(duration - clipDuration, 3);
      end = round(duration, 3);
    }

    onStartEndTimeChange(start, end);
  }

  return (
    <Box 
      sx={style.container}
      ref={ref}>
      <TimelineFrames
        asset={asset}
        timelineWidth={timelineWidth}
        onMouseOver={() => setShowSkipThumb(true)}
        onMouseLeave={() => setShowSkipThumb(false)}
        onMouseMove={handleFramesMouseMove}
        onClick={handleFramesClick}/>
      <Box 
        sx={style.control}
        style={{ left: controlLeft, width: controlWidth }}>
        <EditClipControlHandler
          sx={style.leftHandler}
          icon={<ChevronLeft/>}
          time={startTime}
          duration={duration}
          timelineLeft={timelineLeft}
          timelineWidth={timelineWidth}
          onStart={onPreview}
          onChange={onStartTimeChange}
          onEnd={onPreviewEnd}/>
        <EditClipControlHandler
          sx={style.rightHandler}
          icon={<ChevronRight/>}
          time={endTime}
          duration={duration}
          timelineLeft={timelineLeft}
          timelineWidth={timelineWidth}
          onStart={onPreview}
          onChange={onEndTimeChange}
          onEnd={onPreviewEnd}/>
      </Box>
      <TimelineThumb
        time={currentTime}
        startTime={startTime}
        endTime={endTime}
        duration={duration}
        timelineLeft={timelineLeft}
        timelineWidth={timelineWidth}
        onChange={onCurrentTimeChange}/>
      {showSkipThumb &&
        <Box 
          sx={style.skipThumb}
          style={{ left: skipThumbPosition }}>
          <Box sx={style.skipThumbTimecode}>{formatSeconds(skipThumbTime)}</Box>
          <Box sx={style.skipThumbLine}/>
        </Box>
      }
    </Box>
  );
}
