import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useRef, useState, DragEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Container, InputBase } from '@mui/material';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '../protected-route/protected-route.component';
import { ConversionsCounter } from '~/components/conversions-counter/conversions-counter.component';
import { UploadFiles } from '~/components/upload-files/upload-files.component';
import { useUploadFiles } from '~/utils/UploadFilesProvider';
import { EmptyLibrary } from './components/empty-library/empty-library.component';
import { DropArea } from './components/drop-area/drop-area.component';
import { DropDownButton } from './components/drop-down-button/drop-down-button.component';
import { style } from './index.style';

function Library() {

  const inputFileRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation('library');
  const { user } = useUser();
  const { inProgress, uploadFiles } = useUploadFiles();
  const [showDropArea, setShowDropArea] = useState(false);

  function handleInputFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      uploadFiles(event.target.files);
    }
  }

  function handleOpenFilePicker() {
    inputFileRef.current?.click();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {

    event.preventDefault();

    if (event.dataTransfer.files && !inProgress) {
      uploadFiles(event.dataTransfer.files);
    }
    
    setShowDropArea(false);
  }

  function getFileTypes() {
    return [
      ...process.env.NEXT_PUBLIC_SUPPORTED_MIMETYPES?.split(', ') || ['video/mp4'],
      ...process.env.NEXT_PUBLIC_SUPPORTED_FILES_EXT?.split(', ') || ['.mp4']
    ].join(',');
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
        onDragEnter={() => setShowDropArea(true)}>
        <Box sx={style.appBar}>
          <Box sx={style.title}>{t('title')}</Box>
          <DropDownButton onUploadFile={handleOpenFilePicker}/>
        </Box>
        <Container 
          sx={style.content} 
          maxWidth='md'>
          <Box sx={style.toolbar}>
            <Box>{t('toolbarTitle', { email: user?.email })}</Box>
            <ConversionsCounter/>
          </Box>
          <EmptyLibrary
            show={true}
            onUploadFile={handleOpenFilePicker}/>
          <DropArea
            show={showDropArea}
            onHide={() => setShowDropArea(false)}/>
        </Container>
      </Box>
      <InputBase
        sx={style.fileInput}
        type='file'
        inputRef={inputFileRef}
        inputProps={{ accept: getFileTypes(), multiple: true }}
        onChange={handleInputFileChange}/>
      <UploadFiles/>
    </Main>
  );
}

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
