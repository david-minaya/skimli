import { Box } from '@mui/material';
import { style } from './detail-item.style';
import { mergeSx } from '~/utils/style';

interface Props {
  sx?: Partial<typeof style>;
  title: string;
  text: any;
}

export function DetailItem(props: Props) {

  const {
    sx,
    title,
    text
  } = props;

  return (
    <Box sx={mergeSx(style.container, sx?.container)}>
      <Box sx={mergeSx(style.title, sx?.title)}>{title}</Box>
      <Box sx={mergeSx(style.text, sx?.text)}>{text}</Box>
    </Box>
  );
}
