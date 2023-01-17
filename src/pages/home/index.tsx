import Head from "next/head";
import { Box, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { style } from './style';

export function Home() {

  const { user, isLoading, error } = useUser();

  return (
    <Box>
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
    </Box>
  );
};

export const getServerSideProps = withPageAuthRequired();
