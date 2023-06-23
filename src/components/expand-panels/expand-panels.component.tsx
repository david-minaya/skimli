import { ReactNode, useState, createContext } from 'react';
import { Box } from '@mui/material';
import { style } from './expand-panels.style';

export const ExpandPanelContext = createContext({} as { 
  panelId?: string, 
  onClick: (id?: string) => void 
});

interface Props {
  defaultPanel?: string;
  children: ReactNode;
}

export function ExpandPanels(props: Props) {

  const { defaultPanel, children } = props;
  const [panelId, setPanelId] = useState(defaultPanel);

  function onClick(id?: string) {
    setPanelId(id);
  }

  return (
    <ExpandPanelContext.Provider value={{ panelId, onClick }}>
      <Box sx={style.container}>
        {children}
      </Box>
    </ExpandPanelContext.Provider>
  );
}
