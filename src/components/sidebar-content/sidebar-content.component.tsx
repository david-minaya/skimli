import { ReactNode, useContext } from 'react';
import { Box } from '@mui/material';
import { SidebarContext } from '../sidebar/sidebar.component';
import { mergeSx } from '~/utils/style';
import { style } from './sidebar-content.style';

interface Props {
  sx?: Partial<typeof style>;
  id: string;
  title?: string;
  children?: ReactNode;
}

export function SidebarContent(props: Props) {

  const {
    sx,
    id, 
    title, 
    children 
  } = props;
  
  const { tabId } = useContext(SidebarContext);

  if (id !== tabId) return null;

  return (
    <Box sx={mergeSx(style.container, sx?.container)}>
      {title &&
        <Box sx={mergeSx(style.title, sx?.title)}>{title}</Box>
      }
      <Box sx={mergeSx(style.content, sx?.content)}>
        {children}
      </Box>
    </Box>
  );
}
