import { ReactNode, useContext } from 'react';
import { Box } from '@mui/material';
import { ChevronDownIcon } from '~/icons/chevronDownIcon';
import { style } from './expand-panel.style';
import { mergeSx } from '~/utils/style';
import { ExpandPanelContext } from '../expand-panels/expand-panels.component';

interface Props {
  id: string;
  title: string;
  children?: ReactNode
}

export function ExpandPanel(props: Props) {
  
  const { id, title, children } = props;
  const { panelId, onClick } = useContext(ExpandPanelContext);
  const expanded = id === panelId;

  function handleClick() {
    if (!panelId || panelId !== id) {
      onClick(id);
    } else {
      onClick(undefined);
    }
  }
  
  return (
    <Box sx={mergeSx(style.container, expanded && style.containerExpanded)}>
      <Box 
        sx={style.header}
        onClick={handleClick}>
        <Box sx={style.title}>{title}</Box>
        <ChevronDownIcon sx={mergeSx(style.icon, expanded && style.iconExpanded)}/>
      </Box>
      <Box sx={style.content}>
        {children}
      </Box>
    </Box>
  );
}
