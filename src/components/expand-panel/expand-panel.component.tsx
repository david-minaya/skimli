import { ReactNode, useContext } from 'react';
import { Box } from '@mui/material';
import { ChevronDownIcon } from '~/icons/chevronDownIcon';
import { mergeSx } from '~/utils/style';
import { ExpandPanelContext } from '../expand-panels/expand-panels.component';
import { style } from './expand-panel.style';

interface Props {
  sx?: Partial<typeof style>;
  id: string;
  title: string;
  children?: ReactNode
}

export function ExpandPanel(props: Props) {
  
  const {
    sx, 
    id, 
    title, 
    children 
  } = props;

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
    <Box sx={mergeSx(style.container, sx?.container, expanded && style.containerExpanded)}>
      <Box 
        sx={mergeSx(style.header, sx?.header)}
        onClick={handleClick}>
        <Box sx={mergeSx(style.title, sx?.title)}>{title}</Box>
        <ChevronDownIcon sx={mergeSx(style.icon, sx?.icon, expanded && style.iconExpanded)}/>
      </Box>
      <Box sx={mergeSx(style.content, sx?.content)}>
        {children}
      </Box>
    </Box>
  );
}
