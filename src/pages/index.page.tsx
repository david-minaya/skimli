import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Loading } from '~/components/loading/loading.component';
import { useAccount } from '~/reducer/provider';
import { ProtectedRoute } from '~/components/protected-route/protected-route.component';

function Index() {

  const router = useRouter();
  const account = useAccount();

  useEffect(() => {
    if (account) {
      router.push(`/organizations/${account.org}/library`)
    } else {
      router.push('/onboarding');
    }
  }, [router, account]);

  return <Loading/>
}

export default function Page() {
  return (
    <ProtectedRoute>
      <Index/>
    </ProtectedRoute>
  )
}

export const getServerSideProps = withPageAuthRequired();
