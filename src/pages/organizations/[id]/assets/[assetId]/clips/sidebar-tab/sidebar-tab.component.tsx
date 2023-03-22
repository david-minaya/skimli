import { Box } from '@mui/material';
import { mergeSx } from '~/utils/style';
import { style } from './sidebar-tab.style';

interface Props {
  id: string;
  selectedId: string;
  icon: JSX.Element;
  onClick: (id: string) => void;
}

export function SidebarTab(props: Props) {

  const {
    id,
    selectedId,
    icon,
    onClick
  } = props;

  const selected = id === selectedId;

  return (
    <Box 
      sx={mergeSx(style.container, selected && style.selected)}
      onClick={() => onClick(id)}>
      {icon}
    </Box>
  )
}

