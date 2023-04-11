import { ReactNode, useCallback, MouseEvent, useMemo } from 'react';
import { Box } from '@mui/material';
import { mergeSx } from '~/utils/style';
import { style } from './drag.style';

interface Props {
  time: number;
  duration: number;
  left: number;
  right: number;
  width: number;
  children: ReactNode;
  draggable?: boolean;
  sx?: typeof style['drag'];
  onFocus?: () => void;
  onBlur?: () => void;
  onTimeChange?: (time: number) => void;
}

export function Drag(props: Props) {

  const {
    time,
    duration,
    left,
    right,
    width,
    draggable = true,
    children,
    sx,
    onFocus,
    onBlur,
    onTimeChange
  } = props;

  const position = (width / duration) * Math.min(Math.max(0, time), duration);

  const updatePosition = useMemo(() => {

    let lastTime = 0;
    
    return (pageX: number) => {
    
      const x = Math.min(Math.max(left, pageX), right);
      const time = (duration / width) * (x - left);

      if (time !== lastTime) {
        onTimeChange?.(time);
        lastTime = time;
      }
    }
  }, [duration, left, onTimeChange, right, width]);

  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    updatePosition(event.pageX);
  }, [updatePosition]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((event: MouseEvent<HTMLElement>) => {
    if (onTimeChange) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      updatePosition(event.pageX);
    }
  }, [handleMouseMove, handleMouseUp, updatePosition, onTimeChange]);

  return (
    <Box
      sx={mergeSx(style.drag, sx, draggable && { left: `${position}px` })}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={handleMouseDown}>
      {children}
    </Box>
  );
}
