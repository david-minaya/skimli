import { Box } from '@mui/material';
import { useGetMuxAsset } from '~/graphqls/useGetMuxAsset';
import { Asset } from '~/types/assets.type';
import { style } from './video-item.style';
import { formatDate } from '~/utils/formatDate';
import { RefreshIcon } from '~/icons/refreshIcon';
import { Fragment, useState } from 'react';
import { formatSeconds } from '~/utils/formatSeconds';
import { PlayIcon } from '~/icons/playIcon';

interface Props {
  asset: Asset;
}

export function VideoItem(props: Props) {

  const { asset } = props;

  const [hover, setHover] = useState(false);

  const muxAsset = useGetMuxAsset(asset.sourceMuxAssetId!);

  if (asset.status !== 'PROCESSING' && !muxAsset) {
    return null;
  }

  return (
    <Box sx={style.container}>
      {asset.status === 'PROCESSING' &&
        <Box sx={style.loading}>
          <RefreshIcon sx={style.processingIcon}/>
        </Box>
      }
      {muxAsset &&
        <Box 
          sx={style.imageContainer}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}>
          <Box
            sx={style.image}
            component='img'
            src={`https://image.mux.com/${muxAsset.asset.playback_ids[0].id}/thumbnail.png?token=${muxAsset.tokens.thumbnail}`}/>
          {!hover &&
            <Box sx={style.duration}>
              {formatSeconds(muxAsset.asset.duration)}
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
        {muxAsset &&
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
