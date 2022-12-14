/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { ILegalDoc } from "~/types";

export const getFileName = (fileName: string) => {
  const milliseconds = new Date().getTime();
  return `${fileName.slice(0, fileName.length - 4)}-${milliseconds}`;
};

export const getLinkSlug = (path: string) => {
  let chars = path.split("/");
  return chars[chars.length - 1];
};

export const filterLegalDoc = (path: string, legalDoc: ILegalDoc[]) => {
  const filtered = legalDoc?.find((item: ILegalDoc) =>
    item.pagePath.includes(path)
  );
  return filtered;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
