import TabContext from '@mui/lab/TabContext';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import { TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Container } from '@mui/material';
import { ProfileTab } from './profile-tab/profile-tab.component';
import { SessionsTab } from './sessions-tab/sessions-tab.component';
import { Main } from '~/components/main/main.component';
import { ProtectedRoute } from '~/components/protected-route/protected-route.component';
import { style } from './style';

function Profile() {

  const [tab, setTab] = useState('1');

  return (
    <Main>
      <Box sx={style.container}>
        <Box sx={style.title}>My Profile</Box>
        <Container sx={style.content} maxWidth='md'>
          <TabContext value={tab}>
            <TabList
              sx={style.tabList} 
              onChange={(_, tab) => setTab(tab)}>
              <Tab sx={style.tab} label='Profile' value='1'/>
              <Tab sx={style.tab} label='Notifications' value='2'/>
              <Tab sx={style.tab} label='Sessions' value='3'/>
              <Tab sx={style.tab} label='Applications' value='4'/>
            </TabList>
            <Divider sx={style.divider}/>
            <TabPanel sx={style.tabPanel} value='1'><ProfileTab/></TabPanel>
            <TabPanel sx={style.tabPanel} value='2'>Coming soon</TabPanel>
            <TabPanel sx={style.tabPanel} value='3'><SessionsTab/></TabPanel>
            <TabPanel sx={style.tabPanel} value='4'>Coming soon</TabPanel>
          </TabContext>
        </Container>
      </Box>
    </Main>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <Profile/>
    </ProtectedRoute>
  );
}
