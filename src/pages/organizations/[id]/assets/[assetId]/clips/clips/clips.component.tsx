import { useState } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { Box, Select } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { SearchField } from '~/components/search-field/search-field.component';
import { Asset } from '~/types/assets.type';
import { ClipItem } from '../clip-item/clip-item.component';
import { useAssets } from '~/store/assets.slice';
import { style } from './clips.style';

interface Props {
  asset: Asset;
}

export function Clips(props: Props) {

  const { asset } = props;
  const Assets = useAssets();
  const { t } = useTranslation('editClips');
  const [section, setSection] = useState('clips');

  function handleChange(e: SelectChangeEvent<string>) {
    setSection(e.target.value);
  }

  async function handleSearchChange(value?: string) {
    // console.log('handleSearchChange -> value: ', value);
    // await Assets.fetchClips(value);
  }

  return (
    <Box sx={style.container}>
      <Box sx={style.top}>
        <Select 
          sx={style.select} 
          required={true}
          value={section}
          onChange={handleChange}>
          <MenuItem value='clips'>{t('clips.menu.clips')}</MenuItem>
          <MenuItem value='source-view'>{t('clips.menu.sourceView')}</MenuItem>
        </Select>
        <SearchField
          sx={style.searchField}
          onChange={handleSearchChange}/>
        <Box sx={style.counter}>
          {t('clips.counter', { count: asset.inferenceData?.human.clips.length })}
        </Box>
      </Box>
      <Box sx={style.clips}>
        {asset.inferenceData?.human.clips.map(clip => 
          <ClipItem
            key={clip.uuid}
            clip={clip}
            assetId={asset.uuid}
            playbackId={asset.mux!.asset.playback_ids[0].id}/>
        )}
      </Box>
    </Box>
  )
}
