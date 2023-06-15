import Head from 'next/head';
import InfiniteLoader from 'react-window-infinite-loader';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useRef, useState, DragEvent, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Container, InputBase } from '@mui/material';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '../protected-route/protected-route.component';
import { DropArea } from '../../../../components/drop-area/drop-area.component';
import { MediaItem } from './media-item/media-item.component';
import { NoResultsFound } from '../../../../components/no-results-found/no-results-found.component';
import { AppBar } from '~/components/app-bar/app-bar.component';
import { FixedSizeList } from 'react-window';
import { Toast } from '~/components/toast/toast.component';
import { EmptyList } from '~/components/empty-list/empty-list.component';
import { useAssetMedias } from '~/store/assetMedias.slice';
import { useGetAssetMedias } from '~/graphqls/useGetAssetMedias';
import { UploadMediaFilesProvider, useUploadMediaFiles } from '~/providers/UploadMediaFilesProvider';
import { UploadMediaFileProgress } from '~/components/upload-media-file-progress/upload-media-file-progress.component';
import { style } from './index.style';
import { useMediaUploadSubscription } from '~/graphqls/useMediaUploadSubscription';
import { DeleteDialog } from '~/components/delete-dialog/delete-dialog.component';

function Media() {

  const AssetMedias = useAssetMedias();
  const uploadMediaFiles = useUploadMediaFiles();
  const assetMedias = AssetMedias.getAll();
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const selectedIds = AssetMedias.getSelectedIds();
  const getAssetMedias = useGetAssetMedias();

  const { t } = useTranslation('media');
  const { user } = useUser();
  const [showDropArea, setShowDropArea] = useState(false);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteErrorToast, setOpenDeleteErrorToast] = useState(false);

  useEffect(() => {
    AssetMedias.fetchAll();
  }, []);

  useMediaUploadSubscription((media) => {
    AssetMedias.add(media);
  });

  const handleListRef = useCallback((element: HTMLDivElement) => {
    if (element) {
      setListHeight(element.getBoundingClientRect().height);
    }
  }, []);

  function handleInputFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      uploadMediaFiles.upload(event.target.files);
    }
  }

  function handleOpenFilePicker() {
    hiddenFileInputRef.current?.click();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {

    event.preventDefault();

    if (event.dataTransfer.files && !uploadMediaFiles.inProgress) {
      uploadMediaFiles.upload(event.dataTransfer.files);
    }
    
    setShowDropArea(false);
  }

  async function handleSearchChange(value?: string) {
    setIsSearching(value !== undefined && value !== '');
    setSearch(value || '');
    await AssetMedias.fetchAll(value);
  }

  const handleLoadMoreAssetMedias = useCallback(async () => {
    
    try {
      
      if (!isLoading) {

        setIsLoading(true);

        const medias = await getAssetMedias({ 
          name: search, 
          skip: assetMedias.entities.length, 
          take: 20 
        });
        
        AssetMedias.addMany(medias.filter(media => media.type === 'IMAGE' || media.type === 'AUDIO'));
        
        setIsLoading(false);
      }

    } catch (err) {

      setIsLoading(false);
    }
  }, [isLoading, search, assetMedias.entities.length]);

  function handleUnselectAll() {
    AssetMedias.unSelectAll();
  }

  async function handleDelete() {

    setOpenDeleteDialog(false);

    try {
      await AssetMedias.deleteMany(selectedIds);
      AssetMedias.unSelectAll();
    } catch (err: any) {
      setOpenDeleteErrorToast(true);
      AssetMedias.unSelectAll();
    }
  }

  function getFileTypes() {
    return [
      ...process.env.NEXT_PUBLIC_IMAGE_EXTS?.split(', ') || [],
      ...process.env.NEXT_PUBLIC_IMAGE_MIMETYPES?.split(', ') || [],
      ...process.env.NEXT_PUBLIC_AUDIO_EXTS?.split(', ') || [],
      ...process.env.NEXT_PUBLIC_AUDIO_MIMETYPES?.split(', ') || []
    ].join(',');
  }

  const mediaItemProps = useMemo(() => ({
    medias: assetMedias.entities, 
    showCheckBox: selectedIds.length > 0
  }), [assetMedias.entities, selectedIds.length]);

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
          title={t('appBarTitle')}
          selectedItemsCounter={selectedIds.length}
          disableUploadOption={uploadMediaFiles.inProgress}
          onSearchChange={handleSearchChange}
          onUploadFile={handleOpenFilePicker}
          onUnselect={handleUnselectAll}
          onDelete={() => setOpenDeleteDialog(true)}/>
        <Container sx={style.content}>
          {!isSearching &&
            <Box sx={style.toolbar}>
              <Box>{t('toolbarTitle', { email: user?.email })}</Box>
              <Box sx={style.filesQuantity}>
                {t('filesQuantity', { count: assetMedias.entities.length })}
              </Box>
            </Box>
          }
          {isSearching &&
            <Box sx={style.toolbar}>
              <Box sx={style.searchTitle}>{t('searchTitle')}</Box>
              {assetMedias.success &&
                <Box sx={style.results}>
                  {t('searchResults', { count: assetMedias.entities.length })}
                </Box>
              }
            </Box>
          }
          {(assetMedias.loading || assetMedias.entities.length > 0 || isSearching) &&
            <Box sx={style.assetsContainer}>
              <Box sx={style.assetTitle}>{t('listTitle')}</Box>
              {assetMedias.entities.length > 0 &&
                <Box 
                  sx={style.assets}
                  ref={handleListRef}>
                  <InfiniteLoader
                    isItemLoaded={(index) => assetMedias.entities[index] !== undefined}
                    itemCount={1000}
                    loadMoreItems={handleLoadMoreAssetMedias}>
                    {({ onItemsRendered, ref }) => (
                      <FixedSizeList
                        ref={ref}
                        width='100%'
                        height={listHeight}
                        itemCount={assetMedias.entities.length}
                        itemSize={156}
                        itemData={mediaItemProps}
                        onItemsRendered={onItemsRendered}>
                        {MediaItem}
                      </FixedSizeList>
                    )}
                  </InfiniteLoader>
                </Box>
              }
              <NoResultsFound
                show={isSearching && !assetMedias.loading && assetMedias.entities.length === 0}
                image='/images/no-results-found.svg'
                description={t('noResultsFound', { search })}/>
            </Box>
          }
          <EmptyList
            show={assetMedias.success && assetMedias.entities.length === 0 && !isSearching}
            image={'/images/empty-media.png'}
            cardTitle={t('cardTitle')}
            cardDescription={t('cardDescription')}
            button={t('button')}
            disableButton={uploadMediaFiles.inProgress}
            title={t('emptyLibraryTitle')}
            description={t('emptyLibraryDescription')}
            onUploadFile={handleOpenFilePicker}/>
          <DropArea
            show={showDropArea}
            description={t('dropAreaTitle')}
            onHide={() => setShowDropArea(false)}/>
        </Container>
      </Box>
      <UploadMediaFileProgress/>
      <InputBase
        sx={style.hiddenFileInput}
        type='file'
        inputRef={hiddenFileInputRef}
        inputProps={{ accept: getFileTypes(), multiple: true }}
        onChange={handleInputFileChange}/>
      <DeleteDialog
        open={openDeleteDialog}
        title={t('deleteDialog.title')}
        description={t('deleteDialog.description')}
        confirmButton={t('deleteDialog.confirmButton')}
        cancelButton={t('deleteDialog.cancelButton')}
        onConfirm={handleDelete}
        onClose={() => setOpenDeleteDialog(false)}/>
      <Toast
        open={openDeleteErrorToast}
        severity='error'
        description={t('deleteErrorToast')}
        onClose={() => setOpenDeleteErrorToast(false)}/>
    </Main>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <UploadMediaFilesProvider>
        <Media/>
      </UploadMediaFilesProvider>
    </ProtectedRoute>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['media', 'components']))
    }
  };
}
