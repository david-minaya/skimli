/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { FC, ReactNode } from "react";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Footer } from "./footer";
import { MainNavbar } from "./main-navbar";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: "100vh",
  paddingTop: "64px",
  position: "relative",
}));

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <MainLayoutRoot>
      <MainNavbar />
      {children}
      <Footer />
    </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};
