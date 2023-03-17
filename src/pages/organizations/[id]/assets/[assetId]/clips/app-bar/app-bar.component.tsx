import { MoreHoriz } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { TextField } from '~/components/text-field/text-field.component';
import { ArrowLeftIcon } from '~/icons/arrowLeftIcon';
import { FolderIcon } from '~/icons/folderIcon';
import { useAccount } from '~/store/account.slice';
import { Asset } from '~/types/assets.type';
import { style } from './app-bar.style';

interface Props {
  asset: Asset;
}

export function AppBar(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('editClips');
  const router = useRouter();
  const account = useAccount().get();

  return (
    <Box sx={style.container}>
      <Box>
        <IconButton
          sx={style.backButton}
          size='small'
          onClick={() => router.push(`/organizations/${account?.org}/library`)}>
          <ArrowLeftIcon/>
        </IconButton>
      </Box>
      <Box sx={style.center}>
        <Box sx={style.titleContainer}>
          <Box sx={style.title}>{t('title')}</Box>
          <TextField 
            sx={style.titleInput as any} 
            value={asset.name}/>
        </Box>
        <Box sx={style.account}>
          <FolderIcon sx={style.folderIcon}/>
          {t('account', { email: account?.email })}
        </Box>
      </Box>
      <Box sx={style.right}>
        <IconButton>
          <MoreHoriz/>
        </IconButton>
      </Box>
    </Box>
  );
}
