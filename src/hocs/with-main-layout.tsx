/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import React from "react";
import { MainLayout } from "~/components/main-layout";

// eslint-disable-next-line react/display-name
export const withMainLayout = (Component) => (props) =>
  (
    <MainLayout>
      <Component {...props} />
    </MainLayout>
  );
