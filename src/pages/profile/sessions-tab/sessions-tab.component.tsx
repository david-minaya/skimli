import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useGetUserLogs } from '~/graphqls/useGetUserLogs';
import { ISession } from '~/graphqls/schema/session';
import { MobileIcon } from '~/icons/mobileIcon';
import { DesktopIcon } from '~/icons/desktopIcon';
import { style } from './sessions-tab.style';

export function SessionsTab() {

  const { t } = useTranslation('profile');
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
      <Box sx={style.title}>{t('sessions.title')}</Box>
      <TableContainer sx={style.tableContainer}>
        <Table stickyHeader>
          <TableHead sx={style.tableHeader}>
            <TableRow>
              <TableCell sx={style.th}></TableCell>
              <TableCell sx={style.th}></TableCell>
              <TableCell sx={style.th}></TableCell>
              <TableCell sx={style.th}>{t('sessions.ipAddress')}</TableCell>
              <TableCell sx={style.th}>{t('sessions.date')}</TableCell>
              <TableCell sx={style.th}>{t('sessions.time')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!sessionHistory &&
              <TableRow>
                <TableCell sx={style.td}>{t('sessions.loading')}</TableCell>
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
