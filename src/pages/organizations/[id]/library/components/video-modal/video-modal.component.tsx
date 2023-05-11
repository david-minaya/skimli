import MuxVideo from '@mux/mux-video-react';
import { useRef } from 'react';
import { Box, IconButton, styled } from '@mui/material';
import { Asset } from '~/types/assets.type';
import { style } from './video-modal.style';
import { CloseOutlined } from '@mui/icons-material';

interface Props {
  asset?: Asset;
  onClose: () => void;
}

const Video = styled(MuxVideo)``;

export function VideoModal(props: Props) {

  const { 
    asset,
    onClose
  } = props;

  const videoRef = useRef<HTMLVideoElement>(null);

  if (!asset || !asset.mux) return null;

  return (
    <Box 
      sx={style.container}
      onClick={onClose}>
      <Box 
        sx={style.content}
        onClick={e => e.stopPropagation()}>
        {/* @ts-ignore */}
        <Video
          sx={style.video}
          ref={videoRef}
          playsInline={true}
          controls={true}
          playbackId={`${asset.mux.asset.playback_ids[0].id}?token=${asset.mux.tokens.video}`}
          poster={`https://image.mux.com/${asset.mux.asset.playback_ids[0].id}/thumbnail.png?token=${asset.mux.tokens.thumbnail}`}/>
        <IconButton 
          sx={style.closeButton} 
          size='large'
          onClick={onClose}>
          <CloseOutlined/>
        </IconButton>
      </Box>
    </Box>
  );
}
