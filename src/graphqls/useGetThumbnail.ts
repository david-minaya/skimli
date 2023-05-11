import { useEffect, useMemo, useState } from 'react';
import { useGetThumbnailQuery } from './useGetThumbnailQuery';

export function useGetThumbnail(playbackId?: string, width?: number, height?: number, time?: number, fitMode?: string) {

  const query = useGetThumbnailQuery();
  const [state, setState] = useState<string>();

  useEffect(() => {
    if (playbackId) {
      query(playbackId, width, height, time, fitMode).then(value => setState(value));
    }
  }, [query, playbackId, width, height, time, fitMode]);

  return useMemo(() => state, [state]);
}
