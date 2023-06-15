import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Box, LinearProgress } from '@mui/material';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '../../../protected-route/protected-route.component';
import { useAssets } from '~/store/assets.slice';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { VideoPlayerProvider, useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { AssetAppBar } from '~/components/asset-app-bar/asset-app-bar.component';
import { LeftSidebar } from './components/left-sidebar/left-sidebar.component';
import { style } from './index.style';
import { Sidebar, SidebarTab, SidebarTabs } from '~/components/sidebar/sidebar.component';
import { SidebarTabInfo } from './components/sidebar-tab-info/sidebar-tab-info.component';
import { VideoPlayer } from '~/components/video-player/video-player.component';
import { PlayButton } from '~/components/play-button/play-button.component';
import { Time } from '~/components/time/time.component';
import { Volume } from '~/components/volume/volume.component';
import { formatDate } from '~/utils/formatDate';
import { Timeline } from './components/timeline/timeline.component';
import { TranscriptIcon } from '~/icons/transcriptIcon';
import { InfoIcon } from '~/icons/infoIcon';
import { SidebarTranscript } from './components/sidebar-transcript/sidebar-transcript.component';
import { CaptionButton } from '~/components/caption-button/caption-button.component';
import { UploadMediaFilesProvider } from '~/providers/UploadMediaFilesProvider';

function Details() {

  const { t } = useTranslation('details');
  const router = useRouter();
  const id = router.query.assetId as string;
  const Assets = useAssets();
  const asset = Assets.getById(id);
  const videoPlayer = useVideoPlayer();

  useAsyncEffect(async () => {
    await Assets.fetchOne(id);
  }, [id]);

  function handleTimeChange(time: number) {
    videoPlayer.updateProgress(time);
  }

  if (!asset) return null;

  return (
    <Main>
      <Box sx={style.container}>
        <AssetAppBar asset={asset}/>
        <Box sx={style.content}>
          <LeftSidebar asset={asset}/>
          <Box sx={style.centerContainer}>
            <Box sx={style.center}>
              <Box sx={style.videoContainer}>
                <VideoPlayer
                  sx={style.video}
                  asset={asset}/>
                <LinearProgress
                  variant='determinate'
                  value={videoPlayer.currentTime * 100 / videoPlayer.duration}/>
                <Box sx={style.controls}>
                  <PlayButton/>
                  <Time 
                    sx={style.time} 
                    time={videoPlayer.currentTime} 
                    duration={videoPlayer.duration}/>
                  <CaptionButton/>
                  <Volume/>
                </Box>
              </Box>
              <Box sx={style.dateContainer}>
                <Box sx={style.dateTitle}>{t('dateTitle')}</Box>
                <Box sx={style.date}>{formatDate(asset.createdAt)}</Box>
              </Box>
              <Timeline
                asset={asset}
                currentTime={videoPlayer.currentTime}
                duration={videoPlayer.duration}
                onTimeChange={handleTimeChange}/>
            </Box>
          </Box>
          <Sidebar defaultTab='transcript'>
            <SidebarTabs>
              <SidebarTab id='transcript' icon={<TranscriptIcon/>}/>
              <SidebarTab id='info' icon={<InfoIcon/>}/>
            </SidebarTabs>
            <SidebarTranscript asset={asset}/>
            <SidebarTabInfo asset={asset}/>
          </Sidebar>
        </Box>
        {/* <UploadFiles/> */}
      </Box>
    </Main>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <UploadMediaFilesProvider>
        <VideoPlayerProvider>
          <Details/>
        </VideoPlayerProvider>
      </UploadMediaFilesProvider>
    </ProtectedRoute>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['details', 'components']))
    }
  };
}
