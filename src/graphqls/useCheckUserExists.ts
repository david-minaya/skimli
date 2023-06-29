import { gql } from '@apollo/client';
import { useQuery } from '~/hooks/useQuery';
import { Account } from './schema/account.type';

export function useCheckUserExists() {
  const query = useQuery();

  return () => {
    return query<Account>({
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
            billingMethod
            subscriptionId
            settings
            features
          }
        }
      `,
    });
  };
}
