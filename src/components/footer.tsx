/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { FC, useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import { useFlags } from "launchdarkly-react-client-sdk";
import { GET_FOOTER_LIST, GET_LEGAL_DOC } from "~/graphqls/contentful";
import { IFooterType, ILegalDoc } from "~/types";
import { useContentful } from "~/hooks";
import { getLinkSlug, filterLegalDoc } from "~/utils/string-format";
import styled from "@emotion/styled";

const LogoContainer = styled.a`
  position: relative;
  width: 70px;
`;

export const Footer: FC = (props) => {
  const { footerSocialTag, contactUsTag } = useFlags();
  const [companyFooter, setCompanyFooter] = useState<{
    title: string;
    items: IFooterType[];
  }>();
  const [socialFooter, setSocialFooter] = useState<{
    title: string;
    items: IFooterType[];
  }>();
  const [legalDoc, setLegalDoc] = useState<ILegalDoc[]>();
  const { data: footerData } = useContentful(GET_FOOTER_LIST);
  const { data: legalData } = useContentful(GET_LEGAL_DOC);

  useEffect(() => {
    if (footerData?.footerLinkListCollection?.items) {
      const footerLinkList = footerData?.footerLinkListCollection?.items;
      if (footerLinkList[0]?.menuTitle === "Social") {
        setSocialFooter({
          title: footerLinkList[0]?.menuTitle,
          items: footerLinkList[0]?.footerLinkItemsCollection?.items,
        });
        setCompanyFooter({
          title: footerLinkList[1]?.menuTitle,
          items: footerLinkList[1]?.footerLinkItemsCollection?.items,
        });
      } else {
        setSocialFooter({
          title: footerLinkList[1]?.menuTitle,
          items: footerLinkList[1]?.footerLinkItemsCollection?.items,
        });
        setCompanyFooter({
          title: footerLinkList[0]?.menuTitle,
          items: footerLinkList[0]?.footerLinkItemsCollection?.items,
        });
      }
    }
  }, [footerData]);

  useEffect(() => {
    legalData?.legalDocumentCollection?.items?.length &&
      setLegalDoc(legalData?.legalDocumentCollection?.items);
  }, [legalData]);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        borderTopColor: "divider",
        borderTopStyle: "solid",
        borderTopWidth: 1,
        pb: { xs: 2, md: 6 },
        pt: 3,
      }}
      {...props}
    >
      <Container maxWidth="lg">
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <NextLink href="/" passHref>
              <LogoContainer>
                <Image
                  src="/static/primary-logo.svg"
                  alt="me"
                  objectFit="contain"
                  width="100%"
                  height="100%"
                />
              </LogoContainer>
            </NextLink>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              mt: { xs: 4, md: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" color="neutral.700">
                {companyFooter?.title}
              </Typography>
              {companyFooter?.items &&
                companyFooter?.items.map(
                  (footer, index) =>
                    !!footer && (
                      <NextLink
                        key={"social-" + index}
                        href={
                          filterLegalDoc(footer.linkUrl, legalDoc ?? [])
                            ? {
                                pathname: "/legal/[slug]",
                                query: {
                                  slug: getLinkSlug(footer.linkUrl),
                                },
                              }
                            : footer.linkUrl
                        }
                        passHref
                      >
                        <Link
                          variant="caption"
                          color="neutral.500"
                          sx={{ mt: 1 }}
                        >
                          {footer.linkName}
                        </Link>
                      </NextLink>
                    )
                )}
            </Box>
            {!!footerSocialTag && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" color="neutral.700">
                  {socialFooter?.title}
                </Typography>
                {socialFooter?.items &&
                  socialFooter?.items.map(
                    (footer, index) =>
                      !!footer && (
                        <NextLink
                          key={"social-" + index}
                          href={footer.linkUrl}
                          passHref
                        >
                          <Link
                            variant="caption"
                            color="neutral.500"
                            target="_blank"
                            sx={{ mt: 1 }}
                          >
                            {footer.linkName}
                          </Link>
                        </NextLink>
                      )
                  )}
              </Box>
            )}
          </Box>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: { xs: "center" }, mt: 4 }}>
          <Typography color="textSecondary" variant="caption">
            <p>Copyright © 2022 Skimli LLC</p>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
