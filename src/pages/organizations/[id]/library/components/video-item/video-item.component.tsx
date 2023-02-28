import { useTranslation } from 'next-i18next';
import { MoreHoriz } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { formatDate } from '~/utils/formatDate';
import { RefreshIcon } from '~/icons/refreshIcon';
import { Fragment, useRef, useState } from 'react';
import { formatSeconds } from '~/utils/formatSeconds';
import { PlayIcon } from '~/icons/playIcon';
import { Asset } from '~/types/assets.type';
import { DeleteDialog } from '../delete-dialog/delete-dialog.component';
import { style } from './video-item.style';
import { useAssets } from '~/store/assets.slice';

interface Props {
  asset: Asset;
  onClick: (asset: Asset) => void;
}

export function VideoItem(props: Props) {

  const { 
    asset,
    onClick,
  } = props;

  const assetsStore = useAssets();
  const menuOptionRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation('library');
  const [hover, setHover] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  function handleOpenDeleteDialog() {
    setOpenDeleteDialog(true);
    setOpenMenu(false);
  }

  async function handleDelete() {
    setOpenDeleteDialog(false);
    await assetsStore.deleteOne(asset.uuid);
    await assetsStore.fetchAll();
  }

  if (asset.status !== 'PROCESSING' && !asset.mux) {
    return null;
  }

  return (
    <Box sx={style.container}>
      {asset.status === 'PROCESSING' &&
        <Box sx={style.loading}>
          <RefreshIcon sx={style.processingIcon}/>
        </Box>
      }
      {asset.mux &&
        <Box 
          sx={style.imageContainer}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => onClick(asset)}>
          <Box
            sx={style.image}
            component='img'
            src={`https://image.mux.com/${asset.mux.asset.playback_ids[0].id}/thumbnail.png?token=${asset.mux.tokens.thumbnail}`}/>
          {!hover &&
            <Box sx={style.duration}>
              {formatSeconds(asset.mux.asset.duration)}
            </Box>
          }
          {hover &&
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
          <Fragment>
            <RefreshIcon sx={style.processingTagIcon}/>
            <Box sx={style.processingTag}>{t('videoItem.processingTag')}</Box>
          </Fragment>
        }
        {asset.status === 'UNCONVERTED' &&
          <Fragment>
            <Box sx={style.unconvertedTag}>{t('videoItem.unconvertedTag')}</Box>
            <IconButton 
              sx={style.menuOption} 
              size='small'
              ref={menuOptionRef}
              onClick={() => setOpenMenu(true)}>
              <MoreHoriz/>
            </IconButton>
          </Fragment>
        }
        {asset.status === 'DELETING' &&
          <Box sx={style.deletingTag}>{t('videoItem.deletingTag')}</Box>
        }
      </Box>
      <Menu
        open={openMenu}
        anchorEl={menuOptionRef.current}
        onClose={() => setOpenMenu(false)}>
        <MenuItem>{t('videoItem.menu.convert')}</MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>{t('videoItem.menu.delete')}</MenuItem>
      </Menu>
      <DeleteDialog
        open={openDeleteDialog}
        onConfirm={handleDelete}
        onClose={() => setOpenDeleteDialog(false)}/>
    </Box>
  )
}
