import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCheckUserExists } from '~/graphqls/useCheckUserExists';
import { Loading } from '../loading/loading.component';
import { useAccount } from '~/store/account.slice';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute(props: Props) {

  const accountStore = useAccount();
  const router = useRouter();
  const account = accountStore.get();
  const checkUserExists = useCheckUserExists();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (account) {
      setLoading(false);
      return;
    }
    
    (async () => {

      try {

        const _account = await checkUserExists();
        
        if (!_account || !_account.subscriptionId) {
          router.push('/onboarding');
          return;
        }
  
        accountStore.set(_account);
        setLoading(false);

      } catch (err: any) {

        console.log('error: ', err);
        router.push('/401');
      }
    })();
  }, [account]);

  if (loading) return <Loading/>;

  return (
    <Fragment>
      {props.children}
    </Fragment>
  );
}
