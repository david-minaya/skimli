import { SidebarContent } from '~/components/sidebar-content/sidebar-content.component';
import { useSubtitles } from '~/hooks/useSubtitles';
import { TranscriptItem } from '~/components/transcript-item/transcript-item.component';
import { useVideoPlayer } from '~/providers/VideoPlayerProvider';
import { Asset } from '~/types/assets.type';
import { useAssets } from '~/store/assets.slice';
import { style } from './sidebar-transcript.style';

interface Props {
  asset: Asset;
}

export function SidebarTranscript(props: Props) {

  const { asset } = props;
  const { status, cues } = useSubtitles(asset.uuid);
  const Assets = useAssets();
  const clip = Assets.getClip(asset.uuid);
  const videoPlayer = useVideoPlayer();

  function handleClick(time: number) {
    videoPlayer.updateProgress(time);
  }

  function filter(cue: VTTCue) {
    return (
      (cue.startTime < clip!.startTime && cue.endTime > clip!.endTime) ||
      (cue.startTime >= clip!.startTime && cue.endTime <= clip!.endTime) ||
      (cue.endTime >= clip!.startTime && cue.endTime < clip!.endTime) ||
      (cue.startTime > clip!.startTime && cue.startTime <= clip!.endTime)
    );
  }

  if (!clip) return null;

  return (
    <SidebarContent 
      sx={style.sidebarContent}
      id='transcript'
      title='Transcript'>
      {status.loading && 'Loading...'}
      {status.empty && 'There aren\'t subtitles'}
      {status.error && 'Error'}
      {status.successfull &&
        cues.filter(filter).map(cue =>
          <TranscriptItem
            key={cue.startTime} 
            time={videoPlayer.currentTime}
            cue={cue}
            onClick={handleClick}/>
        )
      }
    </SidebarContent>
  );
}
