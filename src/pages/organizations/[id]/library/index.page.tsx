import Head from 'next/head';
import InfiniteLoader from 'react-window-infinite-loader';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useRef, useState, DragEvent, useEffect, useCallback, useMemo } from 'react';
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
import { useAseetsUploaded } from '~/graphqls/useAssetsUploaded';
import { useConvertToClipsSubscription } from '~/graphqls/useConvertToClipsSubscription';
import { AssetItem } from './components/asset-item/asset-item.component';
import { VideoModal } from './components/video-modal/video-modal.component';
import { NoResultsFound } from './components/no-results-found/no-results-found.component';
import { AppBar } from './components/app-bar/app-bar.component';
import { Asset } from '~/types/assets.type';
import { useAssets } from '~/store/assets.slice';
import { style } from './index.style';
import { useConversions } from '~/store/conversions.slice';
import { FixedSizeList } from 'react-window';
import { useGetAssets } from '~/graphqls/useGetAssets';

function Library() {

  const Assets = useAssets();
  const Conversions = useConversions();
  const assets = Assets.getAll();
  const areAssetsSelected = Assets.areSelected();
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const getAssets = useGetAssets();

  const { t } = useTranslation('library');
  const { user } = useUser();
  const { inProgress, uploadVideoFiles } = useUploadFiles();
  const [showDropArea, setShowDropArea] = useState(false);
  const [asset, setAsset] = useState<Asset>();
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [assetListHeight, setAssetListHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Assets.fetchAll();
  }, []);

  useAseetsUploaded(() => {
    Assets.fetchAll();
  });

  useConvertToClipsSubscription(asset => {
    Assets.update(asset.uuid, asset);
    Conversions.fetch();
  });

  const handleAssetListRef = useCallback((element: HTMLDivElement) => {
    if (element) {
      setAssetListHeight(element.getBoundingClientRect().height);
    }
  }, []);

  function handleInputFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      uploadVideoFiles(event.target.files);
    }
  }

  function handleOpenFilePicker() {
    hiddenFileInputRef.current?.click();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {

    event.preventDefault();

    if (event.dataTransfer.files && !inProgress) {
      uploadVideoFiles(event.dataTransfer.files);
    }
    
    setShowDropArea(false);
  }

  async function handleSearchChange(value?: string) {
    setIsSearching(value !== undefined && value !== '');
    setSearch(value || '');
    await Assets.fetchAll(value);
  }

  const handleAssetItemClick = useCallback((asset: Asset) => {
    setAsset(asset);
  }, []);

  const handleLoadMoreAssets = useCallback(async () => {
    
    try {
      
      if (!isLoading) {
        setIsLoading(true);
        Assets.addMany(await getAssets(search, assets.entities.length, 20));
        setIsLoading(false);
      }

    } catch (err) {

      setIsLoading(false);
    }
  }, [isLoading, search, assets.entities.length]);

  function getFileTypes() {
    return [
      ...process.env.NEXT_PUBLIC_SUPPORTED_MIMETYPES?.split(', ') || ['video/mp4'],
      ...process.env.NEXT_PUBLIC_SUPPORTED_FILES_EXT?.split(', ') || ['.mp4']
    ].join(',');
  }

  const assetItemProps = useMemo(() => ({
    assets: assets.entities, 
    showCheckBox: areAssetsSelected,
    onClick: handleAssetItemClick
  }), [assets.entities, areAssetsSelected, handleAssetItemClick]);

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
        <AppBar
          onSearchChange={handleSearchChange}
          onOpenFilePicker={handleOpenFilePicker}/>
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
              {assets.success &&
                <Box 
                  sx={style.results}>
                  {t('searchResults', { count: assets.entities.length })}
                </Box>
              }
            </Box>
          }
          {(assets.loading || assets.entities.length > 0 || isSearching) &&
            <Box sx={style.assetsContainer}>
              <Box sx={style.assetTitle}>{t('assetTitle')}</Box>
              {assets.entities.length > 0 &&
                <Box 
                  sx={style.assets}
                  ref={handleAssetListRef}>
                  <InfiniteLoader
                    isItemLoaded={(index) => assets.entities[index] !== undefined}
                    itemCount={1000}
                    loadMoreItems={handleLoadMoreAssets}>
                    {({ onItemsRendered, ref }) => (
                      <FixedSizeList
                        ref={ref}
                        width='100%'
                        height={assetListHeight}
                        itemCount={assets.entities.length}
                        itemSize={156}
                        itemData={assetItemProps}
                        onItemsRendered={onItemsRendered}>
                        {AssetItem}
                      </FixedSizeList>
                    )}
                  </InfiniteLoader>
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
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['library', 'components']))
    }
  };
}
