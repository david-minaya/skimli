import axios from 'axios';
import { useState, MouseEvent } from 'react';
import { Box } from '@mui/material';
import { style } from './timeline-frames.style';
import { useAsyncEffect } from '~/hooks/useAsyncEffect';
import { Asset } from '~/types/assets.type';

interface Storyboard {
  url: string;
  tile_width: number;
  tile_height: number;
  duration: number;
  tiles: {
    start: number;
    x: number;
    y: number;
  }[]
}

interface Props {
  asset: Asset;
  timelineWidth: number;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
  onMouseMove?: (event: MouseEvent<HTMLDivElement>) => void;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export function TimelineFrames(props: Props) {

  const {
    asset,
    timelineWidth,
    onMouseOver,
    onMouseLeave,
    onMouseMove,
    onClick,
  } = props;

  const [storyboard, setStoryboard] = useState<Storyboard>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const tileHeight = 48;
  const tileWidth =  timelineWidth / (storyboard?.tiles.length || 0);

  useAsyncEffect(async () => {

    const playbackId = asset.mux!.asset.playback_ids[0].id;
    const token = asset.mux!.tokens.storyboard;
    const response = await axios.get<Storyboard>(`https://image.mux.com/${playbackId}/storyboard.json?token=${token}`);
    const storyboard = response.data;
    const columns = storyboard.tiles.filter(tile => tile.y === 0).length;
    const rows = storyboard.tiles.length / columns;
    const originalWidth = columns * storyboard.tile_width;
    const originalHeight = rows * storyboard.tile_height;
    const height = tileHeight * rows;
    const scale = originalHeight / height;
    const width = originalWidth / scale;

    storyboard.tiles.forEach(tile => {
      tile.x /= scale;
      tile.y /= scale;
    });
    
    setStoryboard(storyboard);
    setWidth(width);
    setHeight(height);
  });

  return (
    <Box 
      sx={style.frames}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onClick={onClick}>
      {storyboard?.tiles.map(tile =>
        <Box 
          key={tile.start}
          style={{
            width: `${tileWidth}px`,
            height: `${tileHeight}px`,
            flexShrink: 0,
            pointerEvents: 'none',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${storyboard.url})`,
            backgroundSize: `${width}px ${height}px`,
            backgroundPosition: `-${tile.x}px -${tile.y}px`
          }}/>
      )}
    </Box>
  );
}
