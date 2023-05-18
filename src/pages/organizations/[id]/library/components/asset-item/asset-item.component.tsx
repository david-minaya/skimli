import { useTranslation } from 'next-i18next';
import { MoreHoriz } from '@mui/icons-material';
import { useRef, useState, CSSProperties, memo } from 'react';
import { Box, Checkbox, IconButton, Menu, MenuItem } from '@mui/material';
import { formatDate } from '~/utils/formatDate';
import { RefreshIcon } from '~/icons/refreshIcon';
import { formatSeconds } from '~/utils/formatSeconds';
import { PlayIcon } from '~/icons/playIcon';
import { Asset } from '~/types/assets.type';
import { DeleteDialog } from '~/components/delete-dialog/delete-dialog.component';
import { ConvertToClipsModal } from '../convert-to-clips-modal/convert-to-clips-modal.component';
import { WorkflowStatusModal } from '../workflow-status-modal/workflow-status-modal.component';
import { useAssets } from '~/store/assets.slice';
import { useGetThumbnail } from '~/graphqls/useGetThumbnail';
import { Toast } from '~/components/toast/toast.component';
import { StatusTag } from '../status-tag/status-tag.component';
import { useRouter } from 'next/router';
import { useAccount } from '~/store/account.slice';
import { useConversions } from '~/store/conversions.slice';
import { style } from './asset-item.style';
import { areEqual } from 'react-window';

interface Props {
  index: number;
  data: any;
  style: CSSProperties;
}

export const AssetItem = memo(function AssetItem(props: Props) {

  const { 
    index,
    style: inlineStyle,
    data: { assets, showCheckBox, onClick },
  } = props;

  const asset: Asset = { 
    ...assets[index],
    status: assets[index].sourceMuxAssetId ? assets[index].status : 'ERRORED'
  };

  const router = useRouter();
  const Conversions = useConversions();
  const assetsStore = useAssets();
  const accountStore = useAccount();
  const account = accountStore.get();
  const menuOptionRef = useRef<HTMLButtonElement>(null);
  const thumbnail = useGetThumbnail(asset.mux?.asset.playback_ids[0].id, 170, 100);
  const { t } = useTranslation('library');
  const [hover, setHover] = useState(false);
  const [hoverImage, setHoverImage] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);
  const [openConvertToClipsModal, setOpenConvertToClipsModal] = useState(false);
  const [openWorkflowStatusModal, setOpenWorkflowStatusModal] = useState(false);

  function handleStatusTagClick() {
    if (asset.status === 'CONVERTING' || asset.status === 'CONVERTED' || asset.status === 'ERRORED') {
      setOpenWorkflowStatusModal(true);
    }
  }

  function handleConvertToClips() {
    setOpenConvertToClipsModal(true);
    setOpenMenu(false);
  }

  function handleEdit() {
    router.push(`/organizations/${account?.org}/assets/${asset.uuid}/clips`);
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
      await Conversions.fetch();
    
    } catch (err: any) {

      await assetsStore.fetchAll();
      setOpenErrorToast(true);
    }
  }

  return (
    <Box
      style={inlineStyle}
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
            disabled={asset.status === 'CONVERTING' || asset.status === 'ERRORED'} 
            onClick={handleConvertToClips}>
            {t('assetItem.menu.convert')}
          </MenuItem>
        }
        {asset.status === 'CONVERTED' &&
          <MenuItem
            onClick={handleEdit}>
            {t('assetItem.menu.seeClips')}
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
  );
}, areEqual);
