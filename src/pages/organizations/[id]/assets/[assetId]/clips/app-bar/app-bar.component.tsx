import { MoreHoriz } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { TextField } from '~/components/text-field/text-field.component';
import { ArrowLeftIcon } from '~/icons/arrowLeftIcon';
import { FolderIcon } from '~/icons/folderIcon';
import { useAccount } from '~/store/account.slice';
import { Asset } from '~/types/assets.type';
import { style } from './app-bar.style';
import { useRef, useState } from 'react';
import { useAssets } from '~/store/assets.slice';
import { DeleteDialog } from '~/components/delete-dialog/delete-dialog.component';
import { Toast } from '~/components/toast/toast.component';
import { useConversions } from '~/store/conversions.slice';

interface Props {
  asset: Asset;
}

export function AppBar(props: Props) {

  const { asset } = props;
  const { t } = useTranslation('editClips');
  const menuRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const Assets = useAssets();
  const Conversions = useConversions();
  const account = useAccount().get();
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
    
    } catch (err: any) {

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
            {t('deleteOption')}
          </MenuItem>
        </Menu>
      </Box>
      <DeleteDialog
        open={openDeleteDialog}
        onConfirm={handleDelete}
        onClose={() => setOpenDeleteDialog(false)}/>
      <Toast
        open={openErrorToast}
        severity='error'
        description={t('errorToast')}
        onClose={() => setOpenErrorToast(false)}/>
    </Box>
  );
}
