import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useCheckUserExists } from '~/graphqls/useCheckUserExists';
import { Main } from '~/components/main/main.component';
import { Loading } from '~/components/loading/loading.component';
import { useSetAccount } from '~/reducer/provider';
import { style } from './style';

export function Home() {

  const router = useRouter();

  const { user, isLoading, error } = useUser();
  const [loading, setLoading] = useState(true);
  
  const checkUserExists = useCheckUserExists();
  const setAccount = useSetAccount();

  useEffect(() => {

    (async () => {

      try {

        const account = await checkUserExists();
        
        if (!account || !account.subscriptionId) {
          router.push('/onboarding');
          return;
        }
  
        setAccount(account);
        setLoading(false);

      } catch (err: any) {

        console.log('error: ', err);
        router.push('/500');
      }
    })();
  }, []);

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
