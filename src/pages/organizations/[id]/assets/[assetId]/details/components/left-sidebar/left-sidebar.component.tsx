import { useState } from 'react';
import { MenuItem } from '@mui/material';
import { Box, Select } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { style } from './left-sidebar.style';
import { Asset } from '~/types/assets.type';
import { AssetMedia } from '~/types/assetMedia.type';
import { useRouter } from 'next/router';
import { useAccount } from '~/store/account.slice';
import { useGetThumbnail } from '~/graphqls/useGetThumbnail';
import { useGetAssetMedias } from '~/graphqls/useGetAssetMedias';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { MediaItem } from '../media-item/media-item.component';
import { useMediaUploadSubscription } from '~/graphqls/useMediaUploadSubscription';

interface Props {
  asset: Asset;
}

export function LeftSidebar(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('details');
  const [medias, setMedias] = useState<AssetMedia[]>([]);
  const router = useRouter();
  const Account = useAccount();
  const account = Account.get();
  const thumbnail = useGetThumbnail(asset.mux?.asset.playback_ids[0].id, 172, 100);
  const getAssetMedias = useGetAssetMedias();

  useAsyncEffect(async () => {
    setMedias(await getAssetMedias(asset.uuid));
  }, [asset.uuid]);

  useMediaUploadSubscription(async () => {
    setMedias(await getAssetMedias(asset.uuid));
  });

  return (
    <Box sx={style.container}>
      <Select 
        sx={style.select}
        value='source-view'>
        <MenuItem 
          value='clips'
          onClick={() => router.push(`/organizations/${account?.org}/assets/${asset.uuid}/clips`)}>
          {t('menu.clips')}
        </MenuItem>
        <MenuItem 
          value='source-view'
          onClick={() => router.push(`/organizations/${account?.org}/assets/${asset.uuid}/details`)}>
          {t('menu.sourceView')}
        </MenuItem>
      </Select>
      <Box sx={style.title}>{t('assetTitle')}</Box>
      <Box
        component='img'
        sx={style.asset}
        src={thumbnail}/>
      <Box sx={style.mediasTitle}>{t('mediasTitle', { length: medias.length })}</Box>
      {medias.map(media =>
        <MediaItem 
          key={media.uuid} 
          media={media}/>
      )}
    </Box>
  )
}
