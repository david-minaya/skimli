import { WebVTT } from "vtt.js";
import { Box } from "@mui/material";
import { style } from "./transcript-item.style";
import { formatSeconds } from "~/utils/formatSeconds";
import { mergeSx } from "~/utils/style";
import { memo, useEffect, useRef } from "react";

interface Props {
  time: number;
  cue: VTTCue;
  onClick?: (time: number) => void;
}

export const TranscriptItem = memo(function TranscriptItem(props: Props) {
  const { time, cue, onClick } = props;

  const ref = useRef<HTMLDivElement>(null);
  const active = time >= cue.startTime && time <= cue.endTime;
  const isClicked = useRef<boolean>(false);

  useEffect(() => {
    if (active && !isClicked.current) {
      ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    isClicked.current = false;
  }, [active]);

  function handleClick() {
    isClicked.current = true;
    onClick?.(cue.startTime);
  }

  return (
    <Box
      sx={mergeSx(style.container, active && style.active)}
      ref={ref}
      onClick={handleClick}
    >
      <Box sx={style.time}>{formatSeconds(cue.startTime)}</Box>
      <Box
        sx={style.text}
        dangerouslySetInnerHTML={{
          __html: WebVTT.convertCueToDOMTree(window, cue.text).innerHTML,
        }}
      />
    </Box>
  );
}, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  const prevActive =
    prevProps.time >= prevProps.cue.startTime &&
    prevProps.time <= prevProps.cue.endTime;
  const nextActive =
    nextProps.time >= nextProps.cue.startTime &&
    nextProps.time <= nextProps.cue.endTime;
  return (
    prevActive === nextActive &&
    prevProps.cue.startTime === nextProps.cue.startTime &&
    prevProps.cue.endTime === nextProps.cue.endTime &&
    prevProps.cue.text === nextProps.cue.text &&
    prevProps.onClick === nextProps.onClick
  );
}
