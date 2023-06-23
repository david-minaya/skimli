import { ReactNode, MouseEvent, forwardRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { mergeSx } from '~/utils/style';
import { style } from './drag.style';
import { round } from '~/utils/round';

interface Props {
  time?: number;
  startTime?: number;
  endTime?: number;
  duration: number;
  left?: number;
  width: number;
  children: ReactNode;
  draggable?: boolean;
  sx?: typeof style['drag'];
  onFocus?: () => void;
  onBlur?: () => void;
  onStart?: () => void;
  onChange?: (time: number) => void;
  onEnd?: () => void;
}

export const Drag = forwardRef<HTMLDivElement, Props>(function Drag(props, ref) {

  const {
    time = 0,
    startTime = 0,
    duration,
    endTime = duration,
    left = 0,
    width,
    draggable = true,
    children,
    sx,
    onFocus,
    onBlur,
    onStart,
    onChange,
    onEnd
  } = props;

  const position = (width / duration) * time;

  const [ctx] = useState({ 
    left, 
    width, 
    startTime, 
    endTime, 
    duration, 
    lastTime: 0,
    onStart, 
    onChange,
    onEnd,

    updatePosition(x: number) {
      const time = (ctx.duration / ctx.width) * (x - ctx.left);
      const minMax = Math.min(Math.max(ctx.startTime, time), ctx.endTime);
      const rounded = round(minMax, 3);
      if (time !== ctx.lastTime) {
        ctx.onChange?.(rounded);
        ctx.lastTime = rounded;
      }
    },
    
    handleMouseDown(event: MouseEvent<HTMLElement>) {
      if (ctx.onChange) {
        document.addEventListener('mousemove', ctx.handleMouseMove);
        document.addEventListener('mouseup', ctx.handleMouseUp);
        ctx.onStart?.();
        ctx.updatePosition(event.pageX);
      }
    },

    handleMouseMove(event: globalThis.MouseEvent) {
      ctx.updatePosition(event.pageX);
    },
    
    handleMouseUp() {
      document.removeEventListener('mousemove', ctx.handleMouseMove);
      document.removeEventListener('mouseup', ctx.handleMouseUp);
      ctx.onEnd?.();
    },
  });

  useEffect(() => {
    ctx.left = left;
    ctx.width = width;
    ctx.startTime = startTime;
    ctx.endTime = endTime;
    ctx.duration = duration;
    ctx.onStart = onStart;
    ctx.onChange = onChange;
    ctx.onEnd = onEnd;
  }, [ctx, left, width, startTime, endTime, duration, onStart, onChange, onEnd]);

  return (
    <Box
      sx={mergeSx(style.drag, sx)}
      style={{ left: draggable ? position : undefined }}
      ref={ref}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={ctx.handleMouseDown}>
      {children}
    </Box>
  );
});
