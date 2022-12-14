/*
 * Copyright (c) 2021. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import createCache from "@emotion/cache";

export default function createEmotionCache() {
  return createCache({ key: "css", prepend: true });
}
