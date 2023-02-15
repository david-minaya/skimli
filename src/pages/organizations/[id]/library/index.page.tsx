import Head from 'next/head';
import { useState, DragEvent } from 'react';
import { Box, Container, InputBase } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '../protected-route/protected-route.component';
import { ConversionsCounter } from '~/components/conversions-counter/conversions-counter.component';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { UploadIcon } from '~/icons/uploadIcon';
import { useTranslation } from 'next-i18next';
import { style } from './index.style';
import { ChangeEvent, useRef } from 'react';
import { UploadFiles } from '~/components/upload-files/upload-files.component';
import { useUploadFiles } from '~/utils/UploadFilesProvider';

function Library() {

  const inputFileRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const { t } = useTranslation('library');
  const { inProgress, uploadFiles } = useUploadFiles();
  const [showDragArea, setShowDragArea] = useState(false);

  function handleInputFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      uploadFiles(event.target.files);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {

    event.preventDefault();

    if (event.dataTransfer.files && !inProgress) {
      uploadFiles(event.dataTransfer.files);
    }
    
    setShowDragArea(false);
  }

  function getFileTypes() {

    const fileTypes =  [
      ...process.env.NEXT_PUBLIC_SUPPORTED_MIMETYPES?.split(', ') || ['video/mp4'],
      ...process.env.NEXT_PUBLIC_SUPPORTED_FILES_EXT?.split(', ') || ['.mp4']
    ];

    return fileTypes.join(',');
  }

  return (
    <Main>
      <Head>
        <title>{t('tabTitle')}</title>
      </Head>
      <Box 
        sx={style.container}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onDragEnter={() => setShowDragArea(true)}>
        <Box sx={style.title}>{t('title')}</Box>
        <Container 
          sx={style.content} 
          maxWidth='md'>
          <Box sx={style.toolbar}>
            <Box>{t('toolbarTitle', { email: user?.email })}</Box>
            <ConversionsCounter/>
          </Box>
          <Box sx={style.card}>
            <Box>
              <Box sx={style.cardTitle}>{t('cardTitle')}</Box>
              <Box sx={style.cardDescription}>{t('cardDescription')}</Box>
            </Box>
            <OutlinedButton
              title={t('button')}
              icon={UploadIcon}
              disabled={inProgress}
              onClick={() => inputFileRef.current?.click()}/>
            <InputBase
              sx={style.fileInput}
              type='file'
              inputRef={inputFileRef}
              inputProps={{
                accept: getFileTypes(),
                multiple: true
              }}
              onChange={handleInputFileChange}/>
          </Box>
          <Box sx={style.emptyLibrary}>
            <Box
              sx={style.emptyLibraryImage}
              component='img'
              src='/images/empty-library.svg'/>
            <Box sx={style.emptyLibraryTitle}>{t('emptyLibraryTitle')}</Box>
            <Box sx={style.emptyLibraryDescription}>{t`emptyLibraryDescription`}</Box>
          </Box>
          {showDragArea && 
            <Box 
              sx={style.dragArea}
              onDragLeave={e => setShowDragArea(false)}>
              <Box sx={style.dragAreaContent}>
                <Box
                  sx={style.dragAreaImage}
                  component='img'
                  src='/images/upload-file.svg'/>
                <Box sx={style.dragAreaTitle}>
                  Drag your video files here to upload
                </Box>
              </Box>
            </Box>
          }
        </Container>
      </Box>
      <UploadFiles/>
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

export async function getServerSideProps({ locale }) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['library', 'components']))
    }
  }
}
