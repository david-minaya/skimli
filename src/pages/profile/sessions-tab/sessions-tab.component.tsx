import { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useGetUserLogs } from '~/graphqls/useGetUserLogs';
import { ISession } from '~/graphqls/schema/session';
import { style } from './sessions-tab.style';
import { MobileIcon } from '~/icons/mobileIcon';
import { DesktopIcon } from '~/icons/desktopIcon';

export function SessionsTab() {

  const [sessionHistory, setSessionHistory] = useState<ISession[]>();

  const getUserLogs = useGetUserLogs();

  useEffect(() => {

    (async () => {
    
      const sessionHistory = await getUserLogs();
    
      const filtered = sessionHistory
        .filter(session => session.eventType === 'Logged in' || session.eventType === 'Logged out')
        .slice(0, 19);
    
      setSessionHistory(filtered);
    })()
  }, [getUserLogs]);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(Date.parse(date));
  }

  function formatTime(date: string) {
    return new Intl.DateTimeFormat('en-US', { timeStyle: 'long' }).format(Date.parse(date));
  }

  return (
    <Box sx={style.container}>
      <Box sx={style.title}>Session History</Box>
      <TableContainer sx={style.tableContainer}>
        <Table stickyHeader>
          <TableHead sx={style.tableHeader}>
            <TableRow>
              <TableCell sx={style.th}></TableCell>
              <TableCell sx={style.th}></TableCell>
              <TableCell sx={style.th}></TableCell>
              <TableCell sx={style.th}>IP ADDRESS</TableCell>
              <TableCell sx={style.th}>DATE</TableCell>
              <TableCell sx={style.th}>TIME</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!sessionHistory &&
              <TableRow>
                <TableCell sx={style.td}>Loading...</TableCell>
              </TableRow>
            }
            {sessionHistory?.map(session => (
              <TableRow key={session.date}>
                <TableCell sx={style.td}>{
                  session.isMobile 
                    ? <MobileIcon sx={style.icon}/> 
                    : <DesktopIcon sx={style.icon}/>}
                </TableCell>
                <TableCell 
                  sx={[style.td, style.userAgent as any]}>
                  {session.userAgent}
                </TableCell>
                {session.eventType === 'Logged in' &&
                  <TableCell sx={style.td}>
                    <Box sx={style.loggedIn}>{session.eventType}</Box>
                  </TableCell>
                }
                {session.eventType === 'Logged out' &&
                  <TableCell sx={style.td}>
                    <Box sx={style.loggedOut}>{session.eventType}</Box>
                  </TableCell>
                }
                <TableCell sx={style.td}>{session.ip}</TableCell>
                <TableCell sx={style.td}>{formatDate(session.date)}</TableCell>
                <TableCell sx={style.td}>{formatTime(session.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
