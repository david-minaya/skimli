import { Box } from '@mui/material';
import { useState, Fragment, useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { AudioAssetMedia } from '~/types/audioAssetMedia.type';
import { useAssetMedias } from '~/store/assetMedias.slice';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { SearchField } from '~/components/search-field/search-field.component';
import { ExpandPanel } from '~/components/expand-panel/expand-panel.component';
import { SidebarUploadFile } from '~/components/sidebar-upload-file/sidebar-upload-file.component copy';
import { AudioItem } from '../audio-item/audio-item.component';
import { SidebarMiniFileUploader } from '~/components/sidebar-mini-file-uploader/sidebar-mini-file-uploader.component copy';
import { useAssets } from '~/store/assets.slice';
import { useGetMediaSourceUrl } from '~/graphqls/useGetMediaSourceUrl';
import { ExpandPanelContext } from '~/components/expand-panels/expand-panels.component';
import { useLinkMedia } from '~/graphqls/useLinkMedia';
import { useUnlinkMedia } from '~/graphqls/useUnlinkMedia';
import { useAudioContext } from '~/providers/AudioContextProvider';
import { style } from './sidebar-audio-list.style';

interface Props {
  assetId: string;
}

export function SidebarAudioList(props: Props) {

  const { assetId } = props;
  const { t } = useTranslation('editClips');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const AssetMedias = useAssetMedias();
  const Assets = useAssets();
  const clip = Assets.getClip(assetId);
  const expandPanel = useContext(ExpandPanelContext);
  const timelineAudio = Assets.getTimelineAudio(assetId);
  const audioContext = useAudioContext();
  const audioAssets = AssetMedias.get<AudioAssetMedia>({ name, type: 'AUDIO' });
  const isNotEmpty = (name === '' && audioAssets.length !== 0) || name !== '';
  const getMediaSourceUrl = useGetMediaSourceUrl();
  const linkMedia = useLinkMedia();
  const unlinkMedia = useUnlinkMedia();
  
  useAsyncEffect(async () => {
    await AssetMedias.fetchAll();
    setLoading(false);
  });

  useEffect(() => {
    if (timelineAudio?.sources?.id) {
      expandPanel.onClick('edit');
    }
  }, [timelineAudio?.sources?.id]);

  async function handleSearchChange(value?: string) {
    setName(value || '');
  }

  async function handleAttach(audioAsset: AudioAssetMedia, duration: number) {

    await linkMedia(assetId, audioAsset.uuid);

    Assets.addTimelineClip(clip!.uuid, assetId, {
      start: 0,
      length: duration,
      asset: {
        type: 'audio',
        src: await getMediaSourceUrl(audioAsset.uuid),
        trim: 0,
        volume: 0.5
      },
      sources: {
        id: audioAsset.uuid,
        title: audioAsset.name,
        duration: duration
      }
    });

    expandPanel.onClick('edit');
  }

  async function handleDetach(audioAsset: AudioAssetMedia) {
    if (clip && timelineAudio) {
      await unlinkMedia(audioAsset.uuid, assetId);
      Assets.removeTimelineClip(assetId, clip.uuid, timelineAudio.sources!.id);
      audioContext.removeAudioNode();
    }
  }

  const fileTypes = [
    ...process.env.NEXT_PUBLIC_AUDIO_EXTS?.split(', ') || [],
    ...process.env.NEXT_PUBLIC_AUDIO_MIMETYPES?.split(', ') || []
  ].join(',');

  return (
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
            title={t('sidebarAudio.media.uploadFile.title')}
            description={t('sidebarAudio.media.uploadFile.description')}
            link={t('sidebarAudio.media.uploadFile.link')}
            footer={t('sidebarAudio.media.uploadFile.footer')}/>
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
                audioAsset={audioAsset}
                selected={timelineAudio?.sources?.id === audioAsset.uuid}
                onAttach={handleAttach}
                onDetach={handleDetach}/>
            )}
          </Box>
        </Fragment>
      }
    </ExpandPanel>
  );
}
