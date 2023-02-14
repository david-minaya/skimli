import axios, { AxiosProgressEvent } from 'axios';
import { useCallback } from 'react';

type OnUploadProgress = (event: AxiosProgressEvent) => void;

export function useUploadChunk() {

  return useCallback(async (url: string, type: string, chunk: Blob, controller: AbortController, onUploadProgress: OnUploadProgress) => {
    
    const response = await axios.put(url, chunk, {
      headers: { "Content-Type": type },
      signal: controller.signal,
      onUploadProgress: onUploadProgress
    });

    if (!response.headers.etag) {
      throw new Error();
    }

    return response.headers.etag;
  }, [])
}
