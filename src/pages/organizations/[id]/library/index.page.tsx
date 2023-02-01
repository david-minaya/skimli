import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '../protected-route/protected-route.component';
import { style } from './index.style';
import { ConversionsCounter } from '~/components/conversions-counter/conversions-counter.component';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { UploadIcon } from '~/icons/uploadIcon';

function Library() {

  const { user } = useUser();

  return (
    <Main>
      <Head>
        <title>Skimli | Webapp</title>
      </Head>
      <Box sx={style.container}>
        <Box sx={style.title}>Library</Box>
        <Container sx={style.content} maxWidth='md'>
          <Box sx={style.toolbar}>
            <Box>Personal Account - {user?.email}</Box>
            <ConversionsCounter/>
          </Box>
          <Box sx={style.card}>
            <Box>
              <Box sx={style.cardTitle}>Convert your first video!</Box>
              <Box sx={style.cardDescription}>Get started by uploading a video by dragging and dropping</Box>
            </Box>
            <OutlinedButton
              title='Upload Video'
              icon={UploadIcon}/>
          </Box>
          <Box sx={style.emptyLibrary}>
            <Box
              sx={style.emptyLibraryImage}
              component='img'
              src='/images/empty-library.svg'/>
            <Box sx={style.emptyLibraryTitle}>Hmm… Looks like you don’t have any Skim Videos yet!</Box>
            <Box sx={style.emptyLibraryDescription}>
              You new conversions will appear here in the library. Drag and drop a video file or click the upload button to get started!
            </Box>
          </Box>
        </Container>
      </Box>
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
