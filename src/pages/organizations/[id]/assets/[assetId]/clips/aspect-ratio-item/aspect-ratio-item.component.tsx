import { useState } from 'react';
import { Box } from '@mui/material';
import { DownloadClipModal } from '../download-clip-modal/download-clip-modal.component';
import { Asset } from '~/types/assets.type';
import { Clip } from '~/types/clip.type';
import { style } from './aspect-ratio-item.style';

interface Props {
  image?: string;
  aspectRatio: string;
  title: string;
  description?: string;
  clip?: Clip;
  asset: Asset;
  disabled?: boolean;
}

export function AspectRatioItem(props: Props) {

  const { 
    image,
    aspectRatio,
    title,
    description,
    clip,
    asset,
    disabled = false
  } = props;

  const [landscapeHeight, setLandscapeHeight] = useState(0);
  const [portraitWidth, setPortraitWidth] = useState(0);
  const [openDownloadClipModal, setOpenDownloadClipModal] = useState(false);
  const [width, height] = aspectRatio.split(':').map(value => parseInt(value));
  const isLandscape = width > height;
  const iphoneAspectRatio = 19.5 / 9;
  const iphoneFrameWidth = 76;
  const iphoneFrameHeight = iphoneAspectRatio * iphoneFrameWidth;

  function handleLandscapeRef(element: HTMLDivElement) {
    if (element) {
      setLandscapeHeight(element.getBoundingClientRect().height);
    }
  }

  function handlePortraitRef(element: HTMLDivElement) {
    if (element) {
      setPortraitWidth(element.getBoundingClientRect().width);
    }
  }

  return (
    <Box sx={style.container}>
      {isLandscape && 
        <Box 
          sx={style.iphoneFrame}
          style={{ height: `${iphoneFrameWidth}px`, width: `${iphoneFrameHeight}px` }}
          ref={handleLandscapeRef}
          onClick={() => setOpenDownloadClipModal(true)}>
          <Box sx={style.landscapeNorth}/>
          {image &&
            <Box 
              component='img'
              src={image}
              style={{
                width: `${(width / height) * landscapeHeight}px`,
                height: '100%',
                objectFit: 'cover'
              }}/>
          }
        </Box>
      }
      {!isLandscape && 
        <Box 
          sx={style.iphoneFrame}
          style={{ width: `${iphoneFrameWidth}px`, height: `${iphoneFrameHeight}px` }}
          ref={handlePortraitRef}
          onClick={() => setOpenDownloadClipModal(true)}>
          <Box sx={style.portraitNorth}/>
          {image &&
            <Box 
              component='img'
              src={image}
              style={{
                width: '100%',
                height: `${(height / width) * portraitWidth}px`,
                objectFit: 'cover'
              }}/>
          }
        </Box>
      }
      <Box sx={style.title}>{title}</Box>
      <Box sx={style.description}>{description}</Box>
      <DownloadClipModal
        open={openDownloadClipModal && !disabled}
        aspectRatio={aspectRatio}
        clip={clip}
        asset={asset}
        onClose={() => setOpenDownloadClipModal(false)}/>
    </Box>
  );
}
