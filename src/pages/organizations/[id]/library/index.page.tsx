import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useRef, useState, DragEvent, useEffect, useCallback } from 'react';
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
import { useAseetsUploaded } from '~/graphqls/useAssetsUploaded';
import { VideoItem } from './components/video-item/video-item.component';
import { VideoModal } from './components/video-modal/video-modal.component';
import { SearchField } from './components/search-field/search-field.component';
import { NoResultsFound } from './components/no-results-found/no-results-found.component';
import { Asset } from '~/types/assets.type';
import { useAssets } from '~/store/assets.slice';
import { style } from './index.style';

function Library() {

  const assetsStore = useAssets();
  const assets = assetsStore.getAll();
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation('library');
  const { user } = useUser();
  const { inProgress, uploadFiles } = useUploadFiles();
  const [showDropArea, setShowDropArea] = useState(false);
  const [asset, setAsset] = useState<Asset>();
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const update = useCallback(async () => {
    await assetsStore.fetchAll();
  }, [assetsStore])

  const videoUploaded = useCallback(() => {
    update();
  }, [update])

  useEffect(() => { update(); }, [update]);
  useAseetsUploaded(videoUploaded);

  function handleInputFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      uploadFiles(event.target.files);
    }
  }

  function handleOpenFilePicker() {
    hiddenFileInputRef.current?.click();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {

    event.preventDefault();

    if (event.dataTransfer.files && !inProgress) {
      uploadFiles(event.dataTransfer.files);
    }
    
    setShowDropArea(false);
  }

  async function handleSearchChange(value?: string) {
    setIsSearching(value !== undefined && value !== '');
    setSearch(value || '');
    await assetsStore.fetchAll(value);
  }

  function handleVideoItemClick(asset: Asset) {
    setAsset(asset);
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
          <SearchField onChange={handleSearchChange}/>
          <DropDownButton onUploadFile={handleOpenFilePicker}/>
        </Box>
        <Container sx={style.content}>
          {!isSearching &&
            <Box sx={style.toolbar}>
              <Box>{t('toolbarTitle', { email: user?.email })}</Box>
              <ConversionsCounter/>
            </Box>
          }
          {isSearching &&
            <Box sx={style.toolbar}>
              <Box sx={style.searchTitle}>{t('searchTitle')}</Box>
              <Box sx={style.results}>{t('searchResults', { count: assets.entities.length })}</Box>
            </Box>
          }
          {(assets.loading || assets.entities.length > 0 || isSearching) &&
            <Box sx={style.videoContainer}>
              <Box sx={style.videoTitle}>{t('videoTitle')}</Box>
              {assets.entities.length > 0 &&
                <Box sx={style.videos}>
                  {assets.entities.map(asset =>
                    <VideoItem 
                      key={asset.uuid}
                      asset={asset}
                      onClick={handleVideoItemClick}/>
                  )}
                </Box>
              }
              <NoResultsFound 
                show={isSearching && !assets.loading && assets.entities.length === 0}
                search={search}/>
            </Box>
          }
          <EmptyLibrary
            show={assets.success && assets.entities.length === 0 && !isSearching}
            onUploadFile={handleOpenFilePicker}/>
          <DropArea
            show={showDropArea}
            onHide={() => setShowDropArea(false)}/>
        </Container>
      </Box>
      <UploadFiles/>
      <VideoModal 
        asset={asset}
        onClose={() => setAsset(undefined)}/>
      <InputBase
        sx={style.hiddenFileInput}
        type='file'
        inputRef={hiddenFileInputRef}
        inputProps={{ accept: getFileTypes(), multiple: true }}
        onChange={handleInputFileChange}/>
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
