import { useTranslation } from 'next-i18next';
import { MoreHoriz } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { Box, Checkbox, IconButton, Menu, MenuItem } from '@mui/material';
import { formatDate } from '~/utils/formatDate';
import { RefreshIcon } from '~/icons/refreshIcon';
import { formatSeconds } from '~/utils/formatSeconds';
import { PlayIcon } from '~/icons/playIcon';
import { Asset } from '~/types/assets.type';
import { DeleteDialog } from '../delete-dialog/delete-dialog.component';
import { ConvertToClipsModal } from '../convert-to-clips-modal/convert-to-clips-modal.component';
import { WorkflowStatusModal } from '../workflow-status-modal/workflow-status-modal.component';
import { useAssets } from '~/store/assets.slice';
import { useGetThumbnail } from '~/graphqls/useGetThumbnail';
import { Toast } from '~/components/toast/toast.component';
import { StatusTag } from '../status-tag/status-tag.component';
import { style } from './asset-item.style';

interface Props {
  asset: Asset;
  showCheckBox: boolean;
  onClick: (asset: Asset) => void;
}

export function AssetItem(props: Props) {

  const { 
    asset,
    showCheckBox,
    onClick,
  } = props;

  const { t } = useTranslation('library');
  const assetsStore = useAssets();
  const menuOptionRef = useRef<HTMLButtonElement>(null);
  const thumbnail = useGetThumbnail(170, 100, asset.mux?.asset.playback_ids[0].id);
  const [hover, setHover] = useState(false);
  const [hoverImage, setHoverImage] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);
  const [openConvertToClipsModal, setOpenConvertToClipsModal] = useState(false);
  const [openWorkflowStatusModal, setOpenWorkflowStatusModal] = useState(false);

  function handleStatusTagClick() {
    if (asset.status === 'CONVERTING') {
      setOpenWorkflowStatusModal(true);
    }
  }

  function handleConvertToClips() {
    setOpenConvertToClipsModal(true);
    setOpenMenu(false);
  }

  function handleOpenDeleteDialog() {
    setOpenDeleteDialog(true);
    setOpenMenu(false);
  }

  async function handleDelete() {

    try {

      setOpenDeleteDialog(false);
      await assetsStore.deleteOne(asset.uuid);
      await assetsStore.fetchAll();
    
    } catch (err: any) {

      await assetsStore.fetchAll();
      setOpenErrorToast(true);
    }
  }

  if (asset.status !== 'PROCESSING' && !asset.mux || !thumbnail) {
    return null;
  }

  return (
    <Box 
      sx={[
        style.container, 
        asset.selected && style.containerSelected as any
      ]}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <Checkbox 
        sx={[
          style.checkBox, 
          (hover || showCheckBox) && style.checkBoxVisible as any
        ]}
        size='small'
        checked={asset.selected}
        onChange={e => assetsStore.select(asset.uuid, e.target.checked)}/>
      {asset.status === 'PROCESSING' &&
        <Box sx={style.loading}>
          <RefreshIcon sx={style.processingIcon}/>
        </Box>
      }
      {asset.mux &&
        <Box 
          sx={style.imageContainer}
          onMouseEnter={() => setHoverImage(true)}
          onMouseLeave={() => setHoverImage(false)}
          onClick={() => onClick(asset)}>
          <Box
            sx={style.image}
            component='img'
            src={thumbnail}/>
          {!hoverImage &&
            <Box sx={style.duration}>
              {formatSeconds(asset.mux.asset.duration)}
            </Box>
          }
          {hoverImage &&
            <Box sx={style.playContainer}>
              <PlayIcon sx={style.playIcon}/>
            </Box>
          }
        </Box>
      }
      <Box sx={style.info}>
        <Box sx={style.title}>{asset.name}</Box>
        {asset.mux &&
          <Box sx={style.date}>{formatDate(asset.createdAt)}</Box>
        }
      </Box>
      <Box sx={style.status}>
        {asset.status === 'PROCESSING' &&
          <RefreshIcon sx={style.processingTagIcon}/>
        }
        <StatusTag 
          status={asset.status}
          onClick={handleStatusTagClick}/>
        {asset.status !== 'PROCESSING' &&
          <IconButton 
            sx={style.menuOption} 
            size='small'
            ref={menuOptionRef}
            onClick={() => setOpenMenu(true)}>
            <MoreHoriz/>
          </IconButton>
        }
      </Box>
      <Menu
        open={openMenu}
        anchorEl={menuOptionRef.current}
        onClose={() => setOpenMenu(false)}>
        {asset.status !== 'CONVERTED' &&
          <MenuItem 
            disabled={asset.status === 'CONVERTING'} 
            onClick={handleConvertToClips}>
            {t('assetItem.menu.convert')}
          </MenuItem>
        }
        {asset.status === 'CONVERTED' &&
          <MenuItem>
            {t('assetItem.menu.edit')}
          </MenuItem>
        }
        <MenuItem
          disabled={asset.status === 'CONVERTING'} 
          onClick={handleOpenDeleteDialog}>
          {t('assetItem.menu.delete')}
        </MenuItem>
      </Menu>
      <Toast
        open={openErrorToast}
        severity='error'
        description={t('assetItem.errorToast')}
        onClose={() => setOpenErrorToast(false)}/>
      <DeleteDialog
        open={openDeleteDialog}
        onConfirm={handleDelete}
        onClose={() => setOpenDeleteDialog(false)}/>
      <ConvertToClipsModal
        open={openConvertToClipsModal}
        asset={asset}
        onClose={() => setOpenConvertToClipsModal(false)}/>
      <WorkflowStatusModal
        open={openWorkflowStatusModal}
        asset={asset}
        onClose={() => setOpenWorkflowStatusModal(false)}/>
    </Box>
  )
}
