/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {
  UserIntegrations,
} from "./schema/integrations.type";
import { gql } from "@apollo/client";
import { useCallback } from "react";
import { useQuery } from "~/hooks/useQuery";

export function useGetUserIntegrations() {
  const query = useQuery();

  return useCallback(async () => {
    return query<UserIntegrations>({
      name: "getUserIntegrations",
      fetchPolicy: "network-only",
      query: gql`
        query GetUserIntegrations {
          getUserIntegrations {
            currentIntegrations {
              code
              category             
            }
            availableIntegrations {
              code
              category          
            }
            upgradeRequiredIntegrations {
              code
              category            
            }
          }
        }
      `,
    });
  }, [query]);
}
