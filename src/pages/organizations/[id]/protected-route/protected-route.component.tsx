import { Fragment, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from '~/reducer/provider';
import { ProtectedRoute as Protected } from '~/components/protected-route/protected-route.component';

interface Props {
  children: ReactNode;
}

function ValidateOrgId(props: Props) {

  const router = useRouter();
  const account = useAccount();
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
