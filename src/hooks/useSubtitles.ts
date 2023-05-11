import { WebVTT } from 'vtt.js';
import { useCallback, useEffect, useState } from 'react';
import { useGetAssetMedias } from '~/graphqls/useGetAssetMedias';
import { useGetSubtitles } from '~/graphqls/useGetSubtitles';

type Status = 'loading' | 'successful' | 'empty' | 'error';

export function useSubtitles(assetId: string) {
  
  const getAssetMedias = useGetAssetMedias();
  const getSubtitles = useGetSubtitles();
  const [cues, setCues] = useState<VTTCue[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  const fetch = useCallback(async () => {

    try {

      const medias = await getAssetMedias(assetId);
      const subtitleMedia = medias.find(media => media.type === 'SUBTITLE');

      if (!subtitleMedia) {
        setStatus('empty');
        return;
      }
      
      const vtt = await getSubtitles(subtitleMedia.uuid);
      const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
      const cues: VTTCue[] = [];
      
      parser.oncue = (cue: VTTCue) => cues.push(cue);
      parser.parse(vtt);
      parser.flush();

      setStatus('successful');
      setCues(cues);

    } catch (err: any) {

      setStatus('error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId]);

  useEffect(() => {
    fetch();
    return () => {
      setStatus('loading');
      setCues([]);
    };
  }, [fetch]);

  const refresh = useCallback(async () => {
    fetch();
  }, [fetch]);

  return {
    cues,
    status: {
      loading: status === 'loading',
      successfull: status === 'successful',
      empty: status === 'empty',
      error: status === 'error'
    },
    refresh
  };
}
