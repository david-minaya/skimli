import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export interface ISubscribeToPlanArgs {
  productCode: string;
  planCode: string;
  isPaid: boolean;
  provider: 'STRIPE';
  paymentMethodId?: string;
  sessionId?: string;
}

export function useSubscribeToPlan() {
  const client = useApolloClient();

  return useCallback(
    async (args: ISubscribeToPlanArgs) => {
      const response = await client.mutate({
        mutation: gql`
          mutation SubscribeToPlan(
            $productCode: String!
            $planCode: String!
            $isPaid: Boolean!
            $provider: PaymentProviderType!
            $paymentMethodId: String
            $sessionId: String
          ) {
            subscribeToPlan(
              productCode: $productCode
              planCode: $planCode
              isPaid: $isPaid
              provider: $provider
              paymentMethodId: $paymentMethodId
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
            }
          }
        `,
        variables: args,
      });

      if (response.errors || !response.data) {
        throw response.errors;
      }
    },
    [client]
  );
}
