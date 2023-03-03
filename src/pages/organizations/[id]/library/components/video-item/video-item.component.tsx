import { useTranslation } from 'next-i18next';
import { MoreHoriz } from '@mui/icons-material';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Box, Checkbox, IconButton, Menu, MenuItem } from '@mui/material';
import { formatDate } from '~/utils/formatDate';
import { RefreshIcon } from '~/icons/refreshIcon';
import { formatSeconds } from '~/utils/formatSeconds';
import { PlayIcon } from '~/icons/playIcon';
import { Asset } from '~/types/assets.type';
import { DeleteDialog } from '../delete-dialog/delete-dialog.component';
import { useAssets } from '~/store/assets.slice';
import { useGetThumbnail } from '~/graphqls/useGetThumbnail';
import { Toast } from '~/components/toast/toast.component';
import { style } from './video-item.style';

interface Props {
  asset: Asset;
  showCheckBox: boolean;
  onClick: (asset: Asset) => void;
}

export function VideoItem(props: Props) {

  const { 
    asset,
    showCheckBox,
    onClick,
  } = props;

  const { t } = useTranslation('library');
  const assetsStore = useAssets();
  const menuOptionRef = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const [hoverImage, setHoverImage] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [openErrorToast, setOpenErrorToast] = useState(false);

  const getThumbnail = useGetThumbnail();

  useEffect(() => {
    (async () => {
      if (asset.mux) {
        setThumbnail(await getThumbnail(asset.mux.asset.playback_ids[0].id, 170, 100))
      }
    })();
  }, [asset.mux, getThumbnail])

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
      <Toast
        open={openErrorToast}
        severity='error'
        description={t('videoItem.errorToast')}
        onClose={() => setOpenErrorToast(false)}/>
    </Box>
  )
}
