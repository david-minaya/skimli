import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useCheckUserExists } from '~/graphqls/useCheckUserExists';
import { Main } from '~/components/main/main.component';
import { style } from './style';
import { Loading } from '~/components/loading/loading.component';

export function Home() {

  const { user, isLoading, error } = useUser();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const checkUserExists = useCheckUserExists();

  useEffect(() => {

    (async () => {

      try {

        const user = await checkUserExists();

        console.log('user: ', user);
        
        if (!user || !user.subscriptionId) {
          router.push('/onboarding');
          return;
        }
  
        setLoading(false);

      } catch (err: any) {

        console.log('error: ', err);
        router.push('/500');
      }
    })();

  }, [checkUserExists, router]);

  if (loading) return <Loading/>;

  return (
    <Main>
      <Head>
        <title>Skimli | Webapp</title>
      </Head>
      <main>
        <Box>
          {error && <Typography>{error.message}</Typography>}
          {isLoading && <Typography>Loading...</Typography>}
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

export const getServerSideProps = withPageAuthRequired();
