import { Box } from '@mui/material';
import { mergeSx } from '~/utils/style';
import { style } from './status-tag.style';

interface Props {
  text: string;
  sx?: typeof style['tag'];
  onClick?: () => void;
}

export function StatusTag(props: Props) {

  const {
    sx,
    text,
    onClick 
  } = props;

  return (
    <Box 
      sx={mergeSx(style.tag, sx)}
      onClick={onClick}>
      {text}
    </Box>
  );
}
