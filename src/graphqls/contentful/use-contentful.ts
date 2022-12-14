/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import gql from "graphql-tag";

// TODO: Remove this query
// For the webapp, we won't read the footer data from the CMS.
// What we will be reading is the pricing plans data
export const GET_FOOTER_LIST = gql`
  {
    footerLinkListCollection {
      items {
        sys {
          id
        }
        title
        menuTitle
        footerLinkItemsCollection {
          items {
            title
            linkName
            linkUrl
          }
        }
      }
    }
  }
`;

export const GET_LEGAL_DOC = gql`
  {
    legalDocumentCollection {
      items {
        title
        pagePath
        pageTitle
        termlyUrl
      }
    }
  }
`;
