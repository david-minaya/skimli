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
  },
  audio: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: "20px",
    height: "20px",
  },
  text: {
    color: "black",
    fontSize: "12px",
    fontWeight: 500,
    textAlign: "center",
  },
  track: {
    backgroundColor: "#FEDACC",
    border: "1px solid #FC4603",
    borderRadius: "4px",
    height: "100%",
    position: "relative",
  },
});
