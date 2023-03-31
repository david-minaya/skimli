import { Box } from '@mui/material';
import { useState } from 'react';
import { AudioIcon } from '~/icons/audioIcon';
import { ObjectDetectionIcon } from '~/icons/objectDetectionIcon';
import { ShareIcon } from '~/icons/shareIcon';
import { StitchIcon } from '~/icons/stitchIcon';
import { TextIcon } from '~/icons/textIcon';
import { TranscriptIcon } from '~/icons/transcriptIcon';
import { SidebarTabShare } from '../sidebar-tab-share/sidebar-tab-share.component';
import { SidebarTab } from '../sidebar-tab/sidebar-tab.component';
import { style } from './sidebar.style';

export function Sidebar() {

  const [tab, setTab] = useState('share');

  function handleTabClick(id: string) {
    setTab(id);
  }

  return (
    <Box sx={style.container}>
      <Box sx={style.content}>
        <SidebarTabShare id={tab}/>
        <Box sx={{ width: '200px', padding: '8px', fontWeight: 600, fontSize: '15px' }}>
          {tab === 'audio' && 'Audio'}
          {tab === 'text' && 'Text'}
          {tab === 'stitch' && 'Stitch'}
          {tab === 'transcript' && 'Transcript'}
          {tab === 'object-detection' && 'Object detection'}
        </Box>
      </Box>
      <Box sx={style.tabs}>
        <SidebarTab
          id='share'
          selectedId={tab}
          icon={<ShareIcon/>}
          onClick={handleTabClick}/>
        <SidebarTab
          id='audio'
          selectedId={tab}
          icon={<AudioIcon/>}
          onClick={handleTabClick}/>
        <SidebarTab
          id='text'
          selectedId={tab}
          icon={<TextIcon/>}
          onClick={handleTabClick}/>
        <SidebarTab
          id='stitch'
          selectedId={tab}
          icon={<StitchIcon/>}
          onClick={handleTabClick}/>
        <SidebarTab
          id='transcript'
          selectedId={tab}
          icon={<TranscriptIcon/>}
          onClick={handleTabClick}/>
        <SidebarTab
          id='object-detection'
          selectedId={tab}
          icon={<ObjectDetectionIcon/>}
          onClick={handleTabClick}/>
      </Box>
    </Box>
  );
}
