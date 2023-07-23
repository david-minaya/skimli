import { Fragment, ChangeEvent, FocusEvent } from "react";
import { Box, IconButton, Slider, Tooltip } from "@mui/material";
import { useTranslation } from "next-i18next";
import { ExpandPanel } from "~/components/expand-panel/expand-panel.component";
import { useAssets } from "~/store/assets.slice";
import { VolumeIcon } from "~/icons/volumeIcon";
import { style } from "./sidebar-audio-edit.style";
import { useAudioContext } from "~/providers/AudioContextProvider";
import { TextField } from "~/components/text-field/text-field.component";
import { formatSeconds } from "~/utils/formatSeconds";
import { InfoIcon } from "~/icons/infoIcon";

interface Props {
  assetId: string;
}

export function SidebarAudioEdit(props: Props) {
  const { assetId } = props;
  const { t } = useTranslation("editClips");

  const assets = useAssets();
  const clip = assets.getClip(assetId);
  const timelineAudio = assets.getTimelineAudio(assetId);
  const audioContext = useAudioContext();

  function handleVolumeChange(event: Event, value: number | number[]) {
    audioContext.audioNode?.gain.gain.setValueAtTime(value as number, 0);
    audioContext.videoNode?.gain.gain.setValueAtTime(1 - (value as number), 0);

    assets.updateTimelineClip(assetId, clip?.uuid, timelineAudio!.sources?.id, {
      asset: {
        volume: value as number,
      },
    });
  }

  function handleTrimChange(event: ChangeEvent<HTMLInputElement>) {
    assets.updateTimelineClip(assetId, clip?.uuid, timelineAudio!.sources?.id, {
      asset: {
        trim: parseInt(event.target.value),
      },
    });
  }

  function handleStartChange(event: ChangeEvent<HTMLInputElement>) {
    assets.updateTimelineClip(assetId, clip?.uuid, timelineAudio!.sources?.id, {
      start: parseInt(event.target.value),
    });
  }

  function handleLengthChange(event: ChangeEvent<HTMLInputElement>) {
    assets.updateTimelineClip(assetId, clip?.uuid, timelineAudio!.sources?.id, {
      length: parseInt(event.target.value),
    });
  }

  function handleVolumeBlur() {
    assets.syncTimeline(assetId, clip!.uuid);
  }

  function handleTrimBlur(event: FocusEvent<HTMLInputElement>) {
    if (event.currentTarget.value === "") {
      assets.updateTimelineClip(
        assetId,
        clip?.uuid,
        timelineAudio!.sources?.id,
        {
          asset: {
            trim: 0,
          },
        }
      );
    }

    assets.syncTimeline(assetId, clip!.uuid);
  }

  function handleStartBlur(event: FocusEvent<HTMLInputElement>) {
    if (event.currentTarget.value === "") {
      assets.updateTimelineClip(
        assetId,
        clip?.uuid,
        timelineAudio!.sources?.id,
        {
          start: 0,
        }
      );
    }

    assets.syncTimeline(assetId, clip!.uuid);
  }

  function handleLengthBlur(event: FocusEvent<HTMLInputElement>) {
    if (event.currentTarget.value === "") {
      assets.updateTimelineClip(
        assetId,
        clip?.uuid,
        timelineAudio!.sources?.id,
        {
          length: timelineAudio?.sources?.duration || 0,
        }
      );
    }

    assets.syncTimeline(assetId, clip!.uuid);
  }

  function trimAndLengthValidator(trim?: number) {
    if (
      trim === undefined ||
      isNaN(trim) ||
      trim > timelineAudio!.sources!.duration!
    ) {
      return `Value must be between 0 and ${Math.round(
        timelineAudio!.sources!.duration!
      )}`;
    }
  }

  function startValidator(start: number) {
    if (isNaN(start) || Math.floor(start) > clip!.endTime) {
      return `Value must be between 0 and ${Math.round(clip!.duration)}`;
    }
  }

  return (
    <ExpandPanel
      sx={style.expandPanel}
      id="edit"
      title={t("sidebarAudio.edit.title")}
    >
      {timelineAudio && (
        <Fragment>
          <Box sx={style.titleContainer}>
            <Box sx={style.title}>{timelineAudio?.sources?.title}</Box>
            <Box sx={style.duration}>
              &nbsp;- {formatSeconds(timelineAudio!.sources?.duration || 0)}
            </Box>
          </Box>
          <Box sx={style.fieldTitle}>
            Volume
            <Tooltip
              sx={style.tooltip}
              title="Set the volume for the audio clip between 0% and 100%"
            >
              <IconButton sx={style.iconButton}>
                <InfoIcon sx={style.icon} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={style.volumeField}>
            <VolumeIcon sx={style.volumeIcon} />
            <Slider
              sx={style.slider}
              min={0}
              max={1}
              step={0.01}
              value={timelineAudio.asset?.volume}
              orientation="horizontal"
              onChange={handleVolumeChange}
              onBlur={handleVolumeBlur}
            />
          </Box>
          <Box sx={style.fieldTitle}>Trim Start</Box>
          <TextField
            sx={style.textField}
            type="number"
            value={timelineAudio.asset.trim?.toString() || ""}
            min={0}
            max={Math.round(timelineAudio.sources?.duration || 0)}
            errorMessage={trimAndLengthValidator(timelineAudio.asset.trim)}
            onChange={handleTrimChange}
            onBlur={handleTrimBlur}
          />
          <Box sx={style.subTitle}>Timing</Box>
          <Box sx={style.fieldTitle}>Start</Box>
          <TextField
            sx={style.textField}
            type="number"
            value={Math.floor(timelineAudio.start).toString()}
            errorMessage={startValidator(timelineAudio.start)}
            onChange={handleStartChange}
            onBlur={handleStartBlur}
          />
          <Box sx={style.fieldTitle}>Length</Box>
          <TextField
            sx={style.textField}
            type="number"
            value={Math.round(timelineAudio.length).toString()}
            min={0}
            max={Math.round(timelineAudio.sources?.duration || 0)}
            errorMessage={trimAndLengthValidator(
              Math.round(timelineAudio.length)
            )}
            onChange={handleLengthChange}
            onBlur={handleLengthBlur}
          />
        </Fragment>
      )}
    </ExpandPanel>
  );
}
