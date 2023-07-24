/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { Box, Typography } from "@mui/material";
import { style } from "./audio-track-timeline.style";
import { AudioIcon } from "~/icons/audioIcon";
import { mergeSx } from "~/utils/style";

//TODO: the audio prop should be of type Clip
interface Props {
  audio: any;
  clipDuration: number;
}

export function AudioTrackTimeline(props: Props) {
  const { audio, clipDuration } = props;
  const left = (1 - (audio.length - audio.start) / audio.length) * 100;
  const width = 100;
  return (
    <Box sx={style.container}>
      <Box sx={style.audio}>
        <AudioIcon sx={style.icon} />
        <Typography sx={style.text}>{audio.sources.title}</Typography>
      </Box>
      <Box
        sx={mergeSx(style.track, {
          left: `${left}%`,
          width: `${width}%`,
        })}
      ></Box>
    </Box>
  );
}
