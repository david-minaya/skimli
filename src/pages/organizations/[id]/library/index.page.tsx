import Head from 'next/head';
import { Box } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '../protected-route/protected-route.component';
import { style } from './index.style';

function Library() {

  const { user } = useUser();

  return (
    <Main>
      <Head>
        <title>Skimli | Webapp</title>
      </Head>
      <main>
        <Box>
          {user &&
            <Box sx={style.content}>
              <Box sx={style.title}>Welcome {user?.email}</Box>
              <Box sx={style.verified}>Email verified: {user?.email_verified ? 'True' : 'False'}</Box>
            </Box>
          }
        </Box>
      </main>
    </Main>
  );
};

export default function Page() {
  return (
    <ProtectedRoute>
      <Library/>
    </ProtectedRoute>
  )
}
