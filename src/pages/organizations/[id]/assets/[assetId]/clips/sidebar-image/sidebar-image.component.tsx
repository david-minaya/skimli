import { useState, Fragment } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ImageMedia } from '~/types/imageMedia.type';
import { useAssetMedias } from '~/store/assetMedias.slice';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { SearchField } from '~/components/search-field/search-field.component';
import { ExpandPanel } from '~/components/expand-panel/expand-panel.component';
import { ExpandPanels } from '~/components/expand-panels/expand-panels.component';
import { SidebarContent } from '~/components/sidebar-content/sidebar-content.component';
import { SidebarUploadFile } from '~/components/sidebar-upload-file/sidebar-upload-file.component copy';
import { SidebarMiniFileUploader } from '~/components/sidebar-mini-file-uploader/sidebar-mini-file-uploader.component copy';
import { ImageItem } from '../image-item/image-item.components';
import { style } from './sidebar-image.style';

export function SidebarImage() {

  const { t } = useTranslation('editClips');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const AssetMedias = useAssetMedias();
  const imageAssets = AssetMedias.get<ImageMedia>({ name, type: 'IMAGE' });
  const isNotEmpty = (name === '' && imageAssets.length !== 0) || name !== '';

  useAsyncEffect(async () => {
    await AssetMedias.fetchAll();
    setLoading(false);
  });

  async function handleSearchChange(value?: string) {
    setName(value || '');
  }

  const fileTypes = [
    ...process.env.NEXT_PUBLIC_IMAGE_EXTS?.split(', ') || [],
    ...process.env.NEXT_PUBLIC_IMAGE_MIMETYPES?.split(', ') || []
  ].join(',');

  return (
    <SidebarContent
      id='image'
      sx={style.sidebarContent}
      title={t('sidebarImage.title')}>
      <ExpandPanels defaultPanel='media'>
        <ExpandPanel
          id='media' 
          sx={style.expandPanel} 
          title={t('sidebarImage.media.title')}>
          {!loading &&
            <Fragment>
              <SidebarUploadFile
                sx={style.sidebarUploadFile}
                show={name === '' && imageAssets.length === 0}
                accept={fileTypes}
                multiple={true}
                title={t('sidebarImage.uploadFile.title')}
                description={t('sidebarImage.uploadFile.description')}
                link={t('sidebarImage.uploadFile.link')}
                footer={t('sidebarImage.uploadFile.footer')}/>
              {isNotEmpty &&
                <Fragment>
                  <SidebarMiniFileUploader
                    accept={fileTypes}
                    multiple={true}
                    title={t('sidebarImage.uploadFile.title')}/>
                  <SearchField
                    sx={style.searchField}
                    onChange={handleSearchChange}/>
                </Fragment>
              }
              {name !== '' &&
                <Box sx={style.searchResults}>{t('sidebarImage.media.searchResult')}</Box>
              }
              {name !== '' && imageAssets.length === 0 &&
                <Box sx={style.notFoundResults}>{t('sidebarImage.media.notFoundResults', { name })}</Box>
              }
              <Box sx={style.imageList}>
                {imageAssets.map(imageAsset =>
                  <ImageItem
                    key={imageAsset.uuid} 
                    imageAsset={imageAsset}/>
                )}
              </Box>
            </Fragment>
          }
        </ExpandPanel>
        <ExpandPanel id='edit' title='Edit'>
          Edit your content here
        </ExpandPanel>
      </ExpandPanels>
    </SidebarContent>
  );
}
