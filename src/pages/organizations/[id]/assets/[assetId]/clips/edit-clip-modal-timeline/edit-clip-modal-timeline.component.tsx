import axios from 'axios';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import { Box } from '@mui/material';
import { style } from './edit-clip-modal-timeline.style';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { Asset } from '~/types/assets.type';
import { ClipTimelineThumb } from '../clip-timeline-thumb/clip-timeline-thumb.component';
import { EditClipControlHandler } from '../edit-clip-control-handler/edit-clip-control-handler.component';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { formatSeconds } from '~/utils/formatSeconds';
import { round } from '~/utils/round';

interface Storyboard {
  url: string;
  tile_width: number;
  tile_height: number;
  duration: number;
  tiles: {
    start: number;
    x: number;
    y: number;
  }[]
}

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
  const [tileHeight] = useState(48);
  const [tileWidth, setTileWidth] = useState(0);
  const [storyboard, setStoryboard] = useState<Storyboard>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [timelineLeft, setTimelineLeft] = useState(0.1);
  const [timelineWidth, setTimelineWidth] = useState(0.1);
  const [showSkipThumb, setShowSkipThumb] = useState(false);
  const [skipThumbPosition, setSkipThumbPosition] = useState(0.1);

  const controlLeft = toFinite((timelineWidth / duration) * startTime);
  const controlWidth = toFinite((timelineWidth / duration) * (endTime - startTime));
  const skipThumbTime = toFinite((duration / timelineWidth) * skipThumbPosition);

  useAsyncEffect(async () => {

    const playbackId = asset.mux!.asset.playback_ids[0].id;
    const token = asset.mux!.tokens.storyboard;
    const response = await axios.get<Storyboard>(`https://image.mux.com/${playbackId}/storyboard.json?token=${token}`);
    const storyboard = response.data;
    const columns = storyboard.tiles.filter(tile => tile.y === 0).length;
    const rows = storyboard.tiles.length / columns;
    const originalWidth = columns * storyboard.tile_width;
    const originalHeight = rows * storyboard.tile_height;
    const height = tileHeight * rows;
    const scale = originalHeight / height;
    const width = originalWidth / scale;

    storyboard.tiles.forEach(tile => {
      tile.x /= scale;
      tile.y /= scale
    })
    
    setStoryboard(storyboard);
    setWidth(width);
    setHeight(height);
  });

  useEffect(() => {

    const calcFrameWidth = () => {
      if (ref.current && storyboard) {
        const rect = ref.current.getBoundingClientRect();
        setTimelineLeft(rect.left);
        setTimelineWidth(rect.width);
        setTileWidth(rect.width / storyboard.tiles.length);
      }
    }

    calcFrameWidth();
    window.addEventListener('resize', calcFrameWidth);

    return () => {
      window.removeEventListener('resize', calcFrameWidth);
    }
  }, [storyboard]);

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

  function toFinite(number: number) {
    return isFinite(number) ? number : 0;
  }

  return (
    <Box 
      sx={style.container}
      ref={ref}>
      <Box 
        sx={style.frames}
        onMouseOver={() => setShowSkipThumb(true)}
        onMouseLeave={() => setShowSkipThumb(false)}
        onMouseMove={handleFramesMouseMove}
        onClick={handleFramesClick}>
        {storyboard?.tiles.map(tile =>
          <Box 
            key={tile.start}
            sx={{
              width: `${tileWidth}px`,
              height: `${tileHeight}px`,
              flexShrink: 0,
              pointerEvents: 'none',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url(${storyboard.url})`,
              backgroundSize: `${width}px ${height}px`,
              backgroundPosition: `-${tile.x}px -${tile.y}px`
            }}/>
        )}
      </Box>
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
      <ClipTimelineThumb
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
