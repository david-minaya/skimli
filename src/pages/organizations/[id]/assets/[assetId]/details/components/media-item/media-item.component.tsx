import { Box } from '@mui/material';
import { AssetMedia } from '~/types/assetMedia.type';
import { TranscriptIcon } from '~/icons/transcriptIcon';
import { longDate } from '~/utils/longDate';
import { style } from './media-item.style';

interface Props {
  media: AssetMedia;
}

export function MediaItem(props: Props) {

  const { media } = props;

  return (
    <Box sx={style.container}>
      <TranscriptIcon sx={style.icon}/>
      <Box sx={style.details}>
        <Box sx={style.title} title={media.name}>{media.name}</Box>
        <Box sx={style.date}>{longDate(media.createdAt)}</Box>
      </Box>
    </Box>
  );
}
