/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { Style, nestedStyle } from "~/utils/style";

export const style = Style({
  expandPanel: nestedStyle({
    content: {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      padding: "0px 12px",
      div: {
        flexShrink: 0,
      },
    },
  }),
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "black",
    fontSize: "14px",
    fontWeight: 500,
    margin: "16px 0px 4px",
  },
  title: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  duration: {
    flexShrink: 0,
  },
  fieldTitle: {
    color: "black",
    fontSize: "14px",
    fontWeight: 500,
    marginTop: "16px",
  },
  volumeField: {
    display: "flex",
    alignItems: "center",
    marginTop: "4px",
  },
  volumeIcon: {
    width: "20px",
    height: "20px",
  },
  slider: {
    height: "8px",
    margin: "0px 8px",
    "& .MuiSlider-thumb:before": {
      boxShadow: "none",
    },
    "& .MuiSlider-thumb": {
      width: "14px",
      height: "14px",
      border: "2px solid",
      boxShadow: "none",
      borderColor: "white",
    },
  },
  textField: nestedStyle({
    container: {
      width: "100%",
      marginTop: "4px",
    },
  }),
  subTitle: {
    color: "black",
    fontSize: "15px",
    fontWeight: 500,
    textAlign: "center",
    margin: "24px 0px 0px",
  },
  tooltip: {
    maxWidth: "360px",
    backgroundColor: "white",
    color: "black",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: 1,
    padding: "8px",
  },
  iconButton: {
    ml: "8px",
    pl: "0px",
  },
  icon: {
    width: "20px",
    height: "20px",
  },
  warningContainer: {
    marginTop: "4px",
    padding: "8px",
    backgroundColor: "#ffe082",
    color: "black",
    fontSize: "12px",
    fontWeight: 500,
    borderRadius: "4px",
  },
});
