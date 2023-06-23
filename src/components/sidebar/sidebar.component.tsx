import { useState, ReactNode, createContext, useContext } from 'react';
import { Box } from '@mui/material';
import { mergeSx } from '~/utils/style';
import { style } from './sidebar.style';

export const SidebarContext = createContext({} as { 
  tabId: string, 
  onClick: (id: string) => void 
});

export function Sidebar(props: { defaultTab: string, children: ReactNode }) {

  const { defaultTab, children } = props;
  const [tabId, setTabId] = useState(defaultTab);

  function onClick(id: string) {
    setTabId(id);
  }

  return (
    <SidebarContext.Provider value={{ tabId, onClick }}>
      <Box sx={style.container}>
        {children}
      </Box>
    </SidebarContext.Provider>
  );
}

export function SidebarTabs(props: { children: ReactNode }) {
  return (
    <Box sx={style.tabs}>
      {props.children}
    </Box>
  );
}

export function SidebarTab(props: { id: string, icon: JSX.Element }) {

  const { id, icon } = props;
  const { tabId, onClick } = useContext(SidebarContext);

  return (
    <Box 
      sx={mergeSx(style.tab, id === tabId && style.selected)}
      onClick={() => onClick(id)}>
      {icon}
    </Box>
  );
}
