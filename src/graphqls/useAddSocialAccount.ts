/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import {
  IntegrationCodeType,
  AyrshareJwt,
} from '~/graphqls/schema/integrations.type';

interface Response {
  addSocialAccount: AyrshareJwt;
}

export function useAddSocialAccount() {
  const client = useApolloClient();
  return useCallback(
    async (code: IntegrationCodeType) => {
      const response = await client.mutate<Response>({
        mutation: gql`
          mutation AddSocialAccount($code: IntegrationCodeType!) {
            addSocialAccount(code: $code) {
              status
              title
              token
              url
              emailSent
              expiresIn
            }
          }
        `,
        variables: { code },
      });

      if (response.errors || !response.data) {
        throw response.errors;
      }

      return response.data;
    },
    [client]
  );
}
