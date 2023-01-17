import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { ISession } from './schema/session';

interface Response {
  getUserLogs: ISession[];
}

export function useGetUserLogs() {

  const client = useApolloClient();

  return useCallback(async () => {

    const response = await client.query<Response>({
      query: gql`
        query GetUserLogs {
          getUserLogs {
            isMobile
            userAgent
            ip
            eventType
            date
          }
        }
      `
    });

    if (response.error || response.errors || !response.data) {
      throw response.errors;
    }

    return response.data.getUserLogs;
  }, [client]);
}
