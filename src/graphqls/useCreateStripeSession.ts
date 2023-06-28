import { useCallback } from 'react';
import { useSendMutation } from '../hooks/useSendMutation';
import { gql } from '@apollo/client';

export function useCreateStripeSession() {
  const mutation = useSendMutation();

  return useCallback(() => {
    return mutation<string>({
      name: 'createStripeSession',
      mutation: gql`
        mutation CreateStripeSession {
          createStripeSession
        }
      `,
    });
  }, []);
}
