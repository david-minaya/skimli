import { Box } from '@mui/material';
import { useEffect, useState, useCallback, Fragment } from 'react';
import { ClipTimelineThumbIcon } from '~/icons/clipTimelineThumbIcon';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { formatSeconds } from '~/utils/formatSeconds';
import { Clip } from '~/types/clip.type';
import { style } from './clip-timeline-thumb.style';
import { Drag } from '~/components/drag/drag.component';

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
  const time = videoPlayer.currentTime - clip.startTime;
  const [focus, setFocus] = useState(false);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (clipTimelineElement) {
      const rect = clipTimelineElement.getBoundingClientRect();
      setLeft(rect.left);
    }
  }, [clipTimelineElement]);

  const handleTimeChange = useCallback((time: number) => {
    videoPlayer.updateProgress(clip.startTime + time);
  }, [clip]);

  return (
    <Drag
      sx={style.container}
      draggable={false}
      time={time}
      duration={clip.duration}
      left={left}
      right={left + width}
      width={width}
      onTimeChange={handleTimeChange}>
      <Drag
        sx={style.thumb}
        time={time}
        duration={clip.duration}
        left={left}
        right={left + width}
        width={width}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}>
        {!focus &&
          <ClipTimelineThumbIcon 
            sx={style.thumbIcon}/>
        }
        {focus &&
          <Fragment>
            <Box sx={style.thumbTimecode}>{formatSeconds(time, true)}</Box>
            <Box sx={style.thumbTimecodeLine}/>
          </Fragment>
        }
      </Drag>
    </Drag>
  );
}
