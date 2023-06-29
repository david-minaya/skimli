import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { Account } from './schema/account.type';
import { useSendMutation } from '../hooks/useSendMutation';

export interface ISubscribeToPlanArgs {
  productCode: string;
  planCode: string;
  isPaid: boolean;
  provider: 'STRIPE';
  sessionId?: string;
}

export function useSubscribeToPlan() {
  const mutation = useSendMutation();

  return useCallback(async (args: ISubscribeToPlanArgs) => {
    return mutation<Account>({
      name: 'subscribeToPlan',
      mutation: gql`
        mutation SubscribeToPlan(
          $productCode: String!
          $planCode: String!
          $isPaid: Boolean!
          $provider: PaymentProviderType!
          $sessionId: String
        ) {
          subscribeToPlan(
            productCode: $productCode
            planCode: $planCode
            isPaid: $isPaid
            provider: $provider
            sessionId: $sessionId
          ) {
            org
            account
            accountOwner
            idp
            idpUser
            email
            billingMethod
            subscriptionId
            settings
            features
          }
        }
      `,
      variables: args,
    });
  }, []);
}
