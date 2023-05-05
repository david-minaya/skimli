import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box } from '@mui/material';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '../../../protected-route/protected-route.component';
import { AssetAppBar } from '~/components/asset-app-bar/asset-app-bar.component';
import { useAssets } from '~/store/assets.slice';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { Clips } from './clips/clips.component';
import { ClipDetails } from './clip-details/clip-details.component';
import { VideoPlayerProvider } from '~/providers/VideoPlayerProvider';
import { Sidebar, SidebarTabs, SidebarTab } from '~/components/sidebar/sidebar.component';
import { SidebarContent } from '~/components/sidebar-content/sidebar-content.component';
import { SidebarTabShare } from './sidebar-tab-share/sidebar-tab-share.component';
import { ShareIcon } from '~/icons/shareIcon';
import { AudioIcon } from '~/icons/audioIcon';
import { TextIcon } from '~/icons/textIcon';
import { StitchIcon } from '~/icons/stitchIcon';
import { TranscriptIcon } from '~/icons/transcriptIcon';
import { ObjectDetectionIcon } from '~/icons/objectDetectionIcon';
import { SidebarTranscript } from './sidebar-transcript/sidebar-transcript.component';
import { style } from './index.style';

function EditClips() {

  const router = useRouter();
  const id = router.query.assetId as string;
  const assetsStore = useAssets();
  const asset = assetsStore.getById(id);

  useAsyncEffect(async () => {
    await assetsStore.fetchOne(id);
    assetsStore.selectFirstClip(id);
    return () => assetsStore.unSelectClip(id);
  }, [id]);

  if (!asset) return null;

  return (
    <Main>
      <Box sx={style.container}>
        <AssetAppBar asset={asset}/>
        <Box sx={style.content}>
          <VideoPlayerProvider name='edit-clips'>
            <Clips asset={asset}/>
            <ClipDetails asset={asset}/>
            <Sidebar defaultTab='share'>
              <SidebarTabs>
                <SidebarTab id='share' icon={<ShareIcon/>}/>
                <SidebarTab id='audio' icon={<AudioIcon/>}/>
                <SidebarTab id='text' icon={<TextIcon/>}/>
                <SidebarTab id='stitch' icon={<StitchIcon/>}/>
                <SidebarTab id='transcript' icon={<TranscriptIcon/>}/>
                <SidebarTab id='object-detection' icon={<ObjectDetectionIcon/>}/>
              </SidebarTabs>
              <SidebarTabShare/>
              <SidebarTranscript asset={asset}/>
              <SidebarContent id='audio' title='Audio'/>
              <SidebarContent id='text' title='Text'/>
              <SidebarContent id='stitch' title='Stitch'/>
              <SidebarContent id='object-detection' title='Object detection'/>
            </Sidebar>
          </VideoPlayerProvider>
        </Box>
      </Box>
    </Main>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <EditClips/>
    </ProtectedRoute>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['editClips', 'components']))
    }
  }
}
