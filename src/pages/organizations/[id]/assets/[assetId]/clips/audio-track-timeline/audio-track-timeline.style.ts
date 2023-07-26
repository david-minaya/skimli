/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { Style } from "~/utils/style";

export const style = Style({
  container: {
    height: "48px",
    margin: "8px 12px 0px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    borderTop: "1px solid #E6E8F0",
  },
  audio: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2px",
  },
  audioIcon: {
    width: "20px",
    height: "20px",
  },
  filename: {
    color: "black",
    fontSize: "12px",
    fontWeight: 500,
    textAlign: "center",
  },
  duration: {
    color: "black",
    fontSize: "12px",
    fontWeight: 500,
    textAlign: "center",
    marginLeft: "8px",
  },
  trimmedAudioIcon: {
    width: "20px",
    height: "20px",
    fill: "none",
    marginLeft: "24px",
  },
  trimmed: {
    color: "black",
    fontSize: "10px",
    fontWeight: 500,
    textAlign: "center",
    marginRight: "4px",
  },
  clippedAudio: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "24px",
  },
  clippedAudioIcon: {
    width: "20px",
    height: "20px",
    fill: "none",
  },
  clipped: {
    color: "black",
    fontSize: "10px",
    fontWeight: 500,
    textAlign: "center",
    marginLeft: "4px",
  },
  track: {
    backgroundColor: "#FEDACC",
    /*background: "linear-gradient(to right, #FEDACC 80%, #EEEEEE 20%)",*/
    border: "1px solid #FC4603",
    borderRadius: "4px",
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "4px",
  },
  length: {
    color: "black",
    fontSize: "10px",
    fontWeight: 500,
    textAlign: "center",
  },
});
