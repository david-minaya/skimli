import { useTranslation } from "next-i18next";
import { Close } from "@mui/icons-material";
import { toMb } from "~/utils/toMb";
import { formatSeconds } from "~/utils/formatSeconds";
import { Asset, AudioTrack, VideoTrack } from "~/types/assets.type";
import { style } from "./workflow-status-modal.style";

import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
} from "@mui/material";

interface Props {
  open: boolean;
  asset: Asset;
  onClose: () => void;
}

export function WorkflowStatusModal(props: Props) {
  const { open, asset, onClose } = props;

  const { t } = useTranslation("library");

  function formatDate(date: string) {
    const format = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      weekday: "short",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
      hour12: false,
    }).formatToParts(Date.parse(date));

    const get = (type: string) => format.find((v) => v.type === type)?.value;

    return (
      `${get("weekday")}, ` +
      `${get("day")} ` +
      `${get("month")} ` +
      `${get("year")} ` +
      `${get("hour")}:` +
      `${get("minute")}:` +
      `${get("second")} ` +
      `${get("timeZoneName")}`
    );
  }

  function calcElapsedTime() {
    const time = Date.now() - Date.parse(asset.activityStartTime);
    return formatSeconds(time / 1000);
  }

  function calcEndtime() {
    const startTime = asset?.workflows?.find(() => true)?.startTime!;
    const endTime = asset?.workflows?.find(() => true)?.endTime!;
    const diff = Date.parse(endTime) - Date.parse(startTime);
    return formatSeconds(diff / 1000);
  }

  if (!open) {
    return null;
  }

  const videoTrack: VideoTrack = asset.sourceMuxInputInfo?.[0].file.tracks.find(
    (track) => track.type === "video"
  ) as any;
  const audioTrack: AudioTrack = asset.sourceMuxInputInfo?.[0].file.tracks.find(
    (track) => track.type === "audio"
  ) as any;

  const isCompletedOrErrored =
    asset.status == "CONVERTED" || asset.status == "ERRORED";

  return (
    <Dialog open={open} sx={style.dialog} onClose={onClose}>
      <DialogTitle sx={style.title}>
        {asset.name}
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={style.content}>
        <Box sx={style.assetIdContainer}>
          <Box sx={style.assetIdTitle}>
            {t("workflowStatusModal.assetIdTitle")}
          </Box>
          <Box sx={style.assetId}>{asset.uuid}</Box>
        </Box>
        <Box sx={style.sectionTitle}>
          {t("workflowStatusModal.workflowDetails")}
        </Box>
        <Box sx={style.sectionContent}>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.id")}</Box>
            <Box sx={style.itemText}>{asset.uuid}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>
              {t("workflowStatusModal.videoCategory")}
            </Box>
            <Box sx={style.itemText}>{"Other"}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.status")}</Box>
            <Box sx={style.itemTag}>
              {asset.status === "CONVERTING" &&
                t("workflowStatusModal.convertingStatus")}
              {asset.status === "CONVERTED" &&
                t("workflowStatusModal.convertedStatus")}
              {asset.status === "ERRORED" &&
                t("workflowStatusModal.errorStatus")}
            </Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.activity")}</Box>
            <Box sx={style.itemTag}>
              {asset.activityStatus.charAt(0).toUpperCase() +
                asset.activityStatus.slice(1).toLowerCase()}
            </Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>
              {t("workflowStatusModal.timeSubmitted")}
            </Box>
            <Box sx={style.itemText}>{formatDate(asset.activityStartTime)}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>
              {t("workflowStatusModal.timeStarted")}
            </Box>
            <Box sx={style.itemText}>{formatDate(asset.activityStartTime)}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>
              {isCompletedOrErrored
                ? t("workflowStatusModal.timeEnded")
                : t("workflowStatusModal.timeElapsed")}
            </Box>
            <Box
              sx={isCompletedOrErrored ? style.itemText : style.itemElapsedTime}
            >
              {isCompletedOrErrored
                ? formatDate(asset?.workflows?.find(() => true)?.endTime!)
                : calcElapsedTime()}
            </Box>
          </Box>
          {isCompletedOrErrored && (
            <Box sx={style.item}>
              <Box sx={style.itemTitle}>
                {t("workflowStatusModal.duration")}
              </Box>
              <Box sx={style.itemText}>{calcEndtime()}</Box>
            </Box>
          )}
        </Box>
        <Box sx={style.sectionTitle}>
          {t("workflowStatusModal.sourceVideoDetails")}
        </Box>
        <Box sx={style.sectionContent}>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.container")}</Box>
            <Box sx={style.itemText}>
              {asset.sourceMuxInputInfo?.[0].file.container_format}
            </Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.width")}</Box>
            <Box sx={style.itemText}>{videoTrack.width}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.height")}</Box>
            <Box sx={style.itemText}>{videoTrack.height}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.frameRate")}</Box>
            <Box sx={style.itemText}>{videoTrack.frame_rate}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.encoding")}</Box>
            <Box sx={style.itemText}>{videoTrack.encoding}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.duration")}</Box>
            <Box sx={style.itemText}>{formatSeconds(videoTrack.duration)}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.size")}</Box>
            <Box sx={style.itemText}>{toMb(asset.metadata.filesize)} MB</Box>
          </Box>
          <Box sx={style.audioTrackTitle}>
            {t("workflowStatusModal.audioTrackTitle")}
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>
              {t("workflowStatusModal.sampleRatio")}
            </Box>
            <Box sx={style.itemText}>{audioTrack.sample_rate}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.encoding")}</Box>
            <Box sx={style.itemText}>{audioTrack.encoding}</Box>
          </Box>
          <Box sx={style.item}>
            <Box sx={style.itemTitle}>{t("workflowStatusModal.channels")}</Box>
            <Box sx={style.itemText}>{audioTrack.channels}</Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
