import { Fragment, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProtectedRoute as Protected } from '~/components/protected-route/protected-route.component';
import { useAccount } from '~/store/account.slice';

interface Props {
  children: ReactNode;
}

function ValidateOrgId(props: Props) {

  const router = useRouter();
  const accountStore = useAccount();
  const account = accountStore.get();
  const id = router.query.id;

  useEffect(() => {
    if (id !== account?.org.toString()) {
      router.push('/');
    }
  }, [id, router, account]);

  if (id !== account?.org.toString()) {
    return null;
  }

  return (
    <Fragment>
      {props.children}
    </Fragment>
  );
}

export function ProtectedRoute(props: Props) {
  return (
    <Protected>
      <ValidateOrgId>
        {props.children}
      </ValidateOrgId>
    </Protected>
  )
}
