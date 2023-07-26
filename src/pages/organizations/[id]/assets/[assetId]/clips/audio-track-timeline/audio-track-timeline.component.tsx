/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { Box, Typography } from "@mui/material";
import { style } from "./audio-track-timeline.style";
import { AudioIcon } from "~/icons/audioIcon";
import { mergeSx } from "~/utils/style";
import { formatSeconds } from "~/utils/formatSeconds";
import { AudioTrimmingIcon } from "~/icons/audioTrimmingIcon";
import { AudioClippingIcon } from "~/icons/audioClippingIcon";
import { useTranslation } from "next-i18next";

//TODO: the audio prop should be of type Clip<AudioAsset> or Shotstack.Clip<Shotstack.AudioAsset>
//TODO: the clip prop should be of type Clip src/types/clip.type.ts
interface Props {
  audio: any;
  clip: any;
}

export function AudioTrackTimeline(props: Props) {
  const { audio, clip } = props;
  const { t } = useTranslation("editClips");

  const left = ((audio.start / clip.duration) * 100).toFixed(0);
  const width = ((audio.length / clip.duration) * 100).toFixed(0);

  const borderSize = width === "0" ? "0" : "1px";
  function isClipped(): boolean {
    return (
      Math.floor(audio.start) + Math.floor(audio.length) >
      Math.floor(clip.duration)
    );
  }

  function getTrackDuration(): number {
    if (isClipped()) {
      return audio.length - audio.asset.trim - getClippedDuration();
    } else {
      return audio.length - audio.asset.trim;
    }
  }

  function getClippedDuration(): number {
    return (
      Math.floor(audio.start) +
      Math.floor(audio.length) -
      Math.floor(clip.duration)
    );
  }

  return (
    <Box sx={style.container}>
      <Box sx={style.audio}>
        <AudioIcon sx={style.audioIcon} />
        <Typography sx={style.filename}>{audio.sources.title}</Typography>
        <Typography sx={style.duration}>
          {`${formatSeconds(audio.sources.duration)}s`}
        </Typography>
        <AudioTrimmingIcon sx={style.trimmedAudioIcon} />
        <Typography sx={style.trimmed}>
          {`${t("sidebarAudio.timeline.trimmed")} ${formatSeconds(
            audio.asset.trim
          )}s`}
        </Typography>
        {audio.sources && audio.sources.duration && (
          <Box>
            {isClipped() ? (
              <Box sx={style.clippedAudio}>
                <AudioClippingIcon sx={style.clippedAudioIcon} />
                <Typography sx={style.clipped}>
                  {`${t("sidebarAudio.timeline.clipped")} ${formatSeconds(
                    getClippedDuration()
                  )}s`}
                </Typography>
              </Box>
            ) : null}
          </Box>
        )}
      </Box>
      <Box
        sx={mergeSx(style.track, {
          left: `${left}%`,
          width: `${width}%`,
          border: `${borderSize} solid #FC4603`,
        })}
      >
        <Typography sx={style.length}>{`${formatSeconds(
          getTrackDuration()
        )}s`}</Typography>
      </Box>
    </Box>
  );
}
