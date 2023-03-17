import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box } from '@mui/material';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '../../../protected-route/protected-route.component';
import { AppBar } from './app-bar/app-bar.component';
import { useAssets } from '~/store/assets.slice';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { Clips } from './clips/clips.component';
import { ClipDetails } from './clip-details/clip-details.component';
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
        <AppBar asset={asset}/>
        <Box sx={style.content}>
          <Clips asset={asset}/>
          <ClipDetails asset={asset}/>
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
