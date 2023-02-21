import { Box } from '@mui/material';
import { Asset } from '~/types/assets.type';
import { style } from './video-item.style';
import { formatDate } from '~/utils/formatDate';
import { RefreshIcon } from '~/icons/refreshIcon';
import { Fragment, useState } from 'react';
import { formatSeconds } from '~/utils/formatSeconds';
import { PlayIcon } from '~/icons/playIcon';

interface Props {
  asset: Asset;
  onClick: (asset: Asset) => void;
}

export function VideoItem(props: Props) {

  const { 
    asset,
    onClick 
  } = props;

  const [hover, setHover] = useState(false);

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
            <Box sx={style.processingTag}>Processing</Box>
          </Fragment>
        }
      </Box>
    </Box>
  )
}
