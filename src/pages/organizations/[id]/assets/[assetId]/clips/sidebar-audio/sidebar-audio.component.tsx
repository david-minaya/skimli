import { useState, Fragment } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { AudioAssetMedia } from '~/types/audioAssetMedia.type';
import { useAssetMedias } from '~/store/assetMedias.slice';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { SearchField } from '~/components/search-field/search-field.component';
import { ExpandPanel } from '~/components/expand-panel/expand-panel.component';
import { ExpandPanels } from '~/components/expand-panels/expand-panels.component';
import { SidebarContent } from '~/components/sidebar-content/sidebar-content.component';
import { SidebarUploadFile } from '~/components/sidebar-upload-file/sidebar-upload-file.component copy';
import { AudioItem } from '../audio-item/audio-item.component';
import { SidebarMiniFileUploader } from '~/components/sidebar-mini-file-uploader/sidebar-mini-file-uploader.component copy';
import { style } from './sidebar-audio.style';

export function SidebarAudio() {

  const { t } = useTranslation('editClips');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const AssetMedias = useAssetMedias();
  const audioAssets = AssetMedias.get<AudioAssetMedia>({ name, type: 'AUDIO' });
  const isNotEmpty = (name === '' && audioAssets.length !== 0) || name !== '';

  useAsyncEffect(async () => {
    await AssetMedias.fetchAll();
    setLoading(false);
  });

  async function handleSearchChange(value?: string) {
    setName(value || '');
  }

  const fileTypes = [
    ...process.env.NEXT_PUBLIC_AUDIO_EXTS?.split(', ') || [],
    ...process.env.NEXT_PUBLIC_AUDIO_MIMETYPES?.split(', ') || []
  ].join(',');

  return (
    <SidebarContent
      sx={style.sidebarContent}
      id='audio'
      title={t('sidebarAudio.title')}>
      <ExpandPanels defaultPanel='media'>
        <ExpandPanel
          sx={style.expandPanel} 
          id='media' 
          title={t('sidebarAudio.media.title')}>
          {!loading &&
            <Fragment>
              <SidebarUploadFile
                sx={style.sidebarUploadFile}
                show={name === '' && audioAssets.length === 0}
                accept={fileTypes}
                multiple={true}
                title={t('sidebarAudio.uploadFile.title')}
                description={t('sidebarAudio.uploadFile.description')}
                link={t('sidebarAudio.uploadFile.link')}
                footer={t('sidebarAudio.uploadFile.footer')}/>
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
                <Box sx={style.searchResults}>{t('sidebarAudio.media.searchResult')}</Box>
              }
              {name !== '' && audioAssets.length === 0 &&
                <Box sx={style.notFoundResults}>{t('sidebarAudio.media.notFoundResults', { name })}</Box>
              }
              <Box sx={style.audioList}>
                {audioAssets.map(audioAsset =>
                  <AudioItem
                    key={audioAsset.uuid} 
                    audioAsset={audioAsset}/>
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
