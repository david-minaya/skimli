import { MoreHoriz } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ArrowLeftIcon } from '~/icons/arrowLeftIcon';
import { FolderIcon } from '~/icons/folderIcon';
import { useAccount } from '~/store/account.slice';
import { Asset } from '~/types/assets.type';
import { style } from './asset-app-bar.style';
import { useRef, useState } from 'react';
import { useAssets } from '~/store/assets.slice';
import { DeleteDialog } from '~/components/delete-dialog/delete-dialog.component';
import { Toast } from '~/components/toast/toast.component';
import { useConversions } from '~/store/conversions.slice';
import { useEditClipPage } from '~/store/editClipPage.slice';

interface Props {
  asset: Asset;
}

export function AssetAppBar(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('components');
  const menuRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const Assets = useAssets();
  const Conversions = useConversions();
  const account = useAccount().get();
  const renderingClip = useEditClipPage().getRenderingClip();
  const [openMenu, setOpenMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);

  function handleOpenDeleteDialog() {
    setOpenDeleteDialog(true);
    setOpenMenu(false);
  }

  async function handleDelete() {

    try {

      setOpenDeleteDialog(false);
      await Assets.deleteOne(asset.uuid);
      await Assets.fetchAll();
      await Conversions.fetch();
      router.push(`/organizations/${account?.org}/library`);
    
    } catch (err) {

      await Assets.fetchAll();
      setOpenErrorToast(true);
    }
  }

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
        <Box sx={style.title}>{t('assetAppBar.title')} {asset.name}</Box>
        <Box sx={style.account}>
          <FolderIcon sx={style.folderIcon}/>
          {t('assetAppBar.account', { email: account?.email })}
        </Box>
      </Box>
      <Box sx={style.right}>
        {renderingClip &&
          <Box sx={style.renderingClip}>
            <Box sx={style.renderingClipTitle}>{t('assetAppBar.renderingClip')}</Box>
            <CircularProgress size={24}/>
          </Box>
        }
        <IconButton 
          ref={menuRef}
          onClick={() => setOpenMenu(true)}>
          <MoreHoriz/>
        </IconButton>
        <Menu
          anchorEl={menuRef.current}
          open={openMenu}
          onClose={() => setOpenMenu(false)}>
          <MenuItem 
            onClick={handleOpenDeleteDialog}>
            {t('assetAppBar.deleteOption')}
          </MenuItem>
        </Menu>
      </Box>
      <DeleteDialog
        open={openDeleteDialog}
        title={t('assetAppBar.deleteDialog.title')}
        description={t('assetAppBar.deleteDialog.description')}
        confirmButton={t('assetAppBar.deleteDialog.confirmButton')}
        cancelButton={t('assetAppBar.deleteDialog.cancelButton')}
        onConfirm={handleDelete}
        onClose={() => setOpenDeleteDialog(false)}/>
      <Toast
        open={openErrorToast}
        severity='error'
        description={t('assetAppBar.errorDeleteToast')}
        onClose={() => setOpenErrorToast(false)}/>
    </Box>
  );
}
