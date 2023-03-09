import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';
import { Account } from './schema/account.type';

export function useCheckUserExists() {

  const query = useQuery<Account>();

  return () => {
    return query({
      name: 'checkUserExists',
      fetchPolicy: 'network-only',
      query: gql`
        query CheckUserExists {
          checkUserExists {
            org
            account
            accountOwner
            idp
            idpUser
            email
            product
            entitlements
            billingMethod
            subscriptionId
            settings
          }
        }
      `
    });
  }
}
