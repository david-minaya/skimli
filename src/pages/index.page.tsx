import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Loading } from '~/components/loading/loading.component';
import { ProtectedRoute } from '~/components/protected-route/protected-route.component';
import { useAccount } from '~/store/account.slice';

function Index() {

  const router = useRouter();
  const accountStore = useAccount();
  const account = accountStore.get();

  useEffect(() => {
    if (account) {
      router.push(`/organizations/${account.org}/library`);
    } else {
      router.push('/onboarding');
    }
  }, [router, account]);

  return <Loading/>;
}

export default function Page() {
  return (
    <ProtectedRoute>
      <Index/>
    </ProtectedRoute>
  );
}

export const getServerSideProps = withPageAuthRequired();
