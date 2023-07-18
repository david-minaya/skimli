import { useTranslation } from 'next-i18next';
import { ExpandPanels } from '~/components/expand-panels/expand-panels.component';
import { SidebarContent } from '~/components/sidebar-content/sidebar-content.component';
import { SidebarAudioList } from '../sidebar-audio-list/sidebar-audio-list.component';
import { style } from './sidebar-audio.style';
import { SidebarAudioEdit } from '../sidebar-audio-edit/sidebar-audio-edit.component';

interface Props {
  assetId: string;
}

export function SidebarAudio(props: Props) {

  const { assetId } = props;
  const { t } = useTranslation('editClips');

  return (
    <SidebarContent
      sx={style.sidebarContent}
      id='audio'
      title={t('sidebarAudio.title')}>
      <ExpandPanels defaultPanel='media'>
        <SidebarAudioList assetId={assetId}/>
        <SidebarAudioEdit assetId={assetId}/>
      </ExpandPanels>
    </SidebarContent>
  );
}
