import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useCheckUserExists } from '~/graphqls/useCheckUserExists';
import { useAccount, useSetAccount } from '~/reducer/provider';
import { Loading } from '../loading/loading.component';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute(props: Props) {

  const router = useRouter();
  const account = useAccount();
  const checkUserExists = useCheckUserExists();
  const setAccount = useSetAccount();
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
  
        setAccount(_account);
        setLoading(false);

      } catch (err: any) {

        console.log('error: ', err);
        router.push('/404');
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
