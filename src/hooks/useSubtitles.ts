import { WebVTT } from 'vtt.js';
import { useCallback, useEffect, useState } from 'react';
import { useGetAssetMedias } from '~/graphqls/useGetAssetMedias';
import { useGetSubtitles } from '~/graphqls/useGetSubtitles';
import { useGetAutogeneratedSubtitles } from '~/graphqls/useGetAutogeneratedSubtitles';
import { Asset } from '~/types/assets.type';

type Status = 'loading' | 'successful' | 'empty' | 'error';

export function useSubtitles(asset: Asset) {
  
  const getAssetMedias = useGetAssetMedias();
  const getSubtitles = useGetSubtitles();
  const getAutogeneratedSubtitles = useGetAutogeneratedSubtitles();
  const [cues, setCues] = useState<VTTCue[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [autogenerated, setAutogenerated] = useState(false);

  const parse = useCallback((vtt: string) => {

    const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
    const cues: VTTCue[] = [];
    
    parser.oncue = (cue: VTTCue) => cues.push(cue);
    parser.parse(vtt);
    parser.flush();

    setStatus('successful');
    setCues(cues);
  }, []);

  const fetch = useCallback(async () => {

    try {

      const medias = await getAssetMedias(asset.uuid);
      const subtitleMedia = medias.find(media => media.type === 'SUBTITLE');

      if (subtitleMedia) {

        const vtt = await getSubtitles(subtitleMedia.uuid);
        parse(vtt);

      } else {

        const transcription = asset.metadata.transcription;

        if (transcription.status === 'COMPLETED' && transcription.transcriptionFileStatus === 'VALID') {
          const vtt = await getAutogeneratedSubtitles(asset.uuid);
          parse(vtt);
          setAutogenerated(true);
        } else {
          setStatus('empty');
        }
      }
      
    } catch (err: any) {

      setStatus('error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.uuid, asset.metadata.transcription.status, asset.metadata.transcription.transcriptionFileStatus]);

  useEffect(() => {
    fetch();
    return () => {
      setStatus('loading');
      setAutogenerated(false);
      setCues([]);
    };
  }, [fetch]);

  const refresh = useCallback(async () => {
    fetch();
  }, [fetch]);

  return {
    cues,
    autogenerated,
    status: {
      loading: status === 'loading',
      successfull: status === 'successful',
      empty: status === 'empty',
      error: status === 'error'
    },
    refresh
  };
}
