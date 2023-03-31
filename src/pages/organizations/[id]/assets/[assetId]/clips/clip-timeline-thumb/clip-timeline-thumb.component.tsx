import { useEffect, useState, useCallback, MouseEvent, Fragment } from 'react';
import { Box } from '@mui/material';
import { ClipTimelineThumbIcon } from '~/icons/clipTimelineThumbIcon';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { formatSeconds } from '~/utils/formatSeconds';
import { Clip } from '~/types/clips.type';
import { style } from './clip-timeline-thumb.style';

interface Props {
  clip: Clip;
  width: number;
  clipTimelineElement: HTMLDivElement | null;
}

export function ClipTimelineThumb(props: Props) {

  const {
    clip,
    width,
    clipTimelineElement
  } = props;

  const videoPlayer = useVideoPlayer();
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(false);
  const currentTime = videoPlayer.currentTime - clip.startTime;

  const [ctx] = useState({ 
    active: false,
    clip,
    width,
    clipTimelineElement,
    lastTime: 0
  });

  useEffect(() => {
    ctx.clip = clip;
    ctx.width = width;
    ctx.clipTimelineElement = clipTimelineElement;
  }, [clip, width, clipTimelineElement]);

  const handleMouseDown = useCallback((event: MouseEvent<HTMLElement>) => {
    setActive(true);
    updatePosition(event.pageX);
  }, []);

  const handleThumbMouseDown = useCallback((event: MouseEvent<HTMLElement>) => {
    setActive(true);
    videoPlayer.pause();
    updatePosition(event.pageX);
    event.stopPropagation();
  }, []);

  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    updatePosition(event.pageX);
  }, []);

  const handleMouseUp = useCallback(() => {
    setActive(false);
  }, []);

  useEffect(() => {
    if (active) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [active, handleMouseMove, handleMouseUp]);

  function updatePosition(pageX: number) {

    const rect = ctx.clipTimelineElement!.getBoundingClientRect();
    const leftEdge = rect.left;
    const rightEdge = rect.left + ctx.width;
  
    const x = limitPosition(leftEdge, pageX, rightEdge);
    const clipTime = (ctx.clip.duration / ctx.width) * (x - leftEdge);
    const time = ctx.clip.startTime + clipTime;

    if (time !== ctx.lastTime) {
      videoPlayer.updateProgress(time);
      ctx.lastTime = time;
    }
  }

  function calcPosition() {
    const time = limitPosition(0, currentTime, clip.duration);
    const x = (width / clip.duration) * time;
    return x;
  }

  function limitPosition(start: number, position: number, end: number) {
    if (position < start) return start;
    if (position > end) return end;
    return position;
  }

  return (
    <Box 
      sx={style.container}
      tabIndex={0}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onMouseDown={handleMouseDown}>
      <ClipTimelineThumbIcon
        sx={style.thumb}
        onMouseDown={handleThumbMouseDown}
        style={{ 
          left: `${calcPosition()}px`, 
          visibility: !focus ? 'visible' : 'hidden' 
        }}/>
      {focus &&
        <Fragment>
          <Box 
            sx={style.line}
            style={{ left: `${calcPosition()}px` }}
            onMouseDown={handleThumbMouseDown}/>
          <Box 
            sx={style.tag}
            style={{ left: `${calcPosition()}px` }}
            onMouseDown={handleThumbMouseDown}>
            {formatSeconds(currentTime, true)}
          </Box>
        </Fragment>
      }
    </Box>
  );
}
