import { useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { AssetMedia } from '~/types/assetMedia.type';

interface Response {
  mediaUploads: AssetMedia;
}

export function useMediaUploadSubscription(cb: (media: AssetMedia) => void) {
  
  const client = useApolloClient();

  useEffect(() => {
    const observable = client.subscribe<Response>({
      query: gql`
        subscription MediaUploads {
          mediaUploads {
            uuid
            org
            name
            type
            status
            createdAt
            updatedAt
            assets {
              ids
              count
            }
            details {
              ... on SubtitleMediaDetails {
                type
                sourceUrl
              }
              ... on AudioMediaDetails {
                type
                sourceUrl
                muxAssetId
                playbackId
                muxToken
                shotstack {
                  id
                  url
                  status
                  render
                }
              }
              ... on ImageMediaDetails {
                type
                sourceUrl
                cdnUrl
              }
            }
          }
        }
      `,
    });

    const subscription = observable.subscribe((observer) => {
      const media = observer.data?.mediaUploads;
      if (media) {
        cb(media);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}
