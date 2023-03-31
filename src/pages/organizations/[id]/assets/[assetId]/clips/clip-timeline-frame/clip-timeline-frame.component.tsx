import { Box } from '@mui/material';
import { useGetThumbnail } from '~/graphqls/useGetThumbnail';
import { mergeSx } from '~/utils/style';
import { style } from './clip-timeline-frame.style';

interface Props {
  width: number;
  height: number;
  frame: number;
  playbackId: string;
}

export function ClipTimelineFrame(props: Props) {

  const {
    width,
    height,
    frame,
    playbackId
  } = props;

  const thumbnail = useGetThumbnail(playbackId, Math.ceil(width), height, frame, 'smartcrop');

  if (!thumbnail || width === 0) return null;

  return (
    <Box
      component='img'
      sx={mergeSx(style.image, { width: `${width}px`, height: `${height}px` })}
      src={thumbnail}/>
  );
}
