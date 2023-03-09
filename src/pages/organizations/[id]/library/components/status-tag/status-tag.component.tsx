import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Asset } from '~/types/assets.type';
import { style } from './status-tag.style';

interface Props {
  status: Asset['status'];
}

export function StatusTag(props: Props) {

  const { status } = props;
  const { t } = useTranslation('library');

  return (
    <Box 
      sx={[
        style.tag,
        status === 'PROCESSING' && style.processing,
        status === 'UNCONVERTED' && style.unconverted,
        status === 'CONVERTING' && style.converting,
        status === 'CONVERTED' && style.converted,
        status === 'DELETING' && style.deleting as any
      ]}>
      {status === 'PROCESSING' && t('assetItem.tags.processing')}
      {status === 'UNCONVERTED' && t('assetItem.tags.unconverted')}
      {status === 'CONVERTING' && t('assetItem.tags.converting')}
      {status === 'CONVERTED' && t('assetItem.tags.converted')}
      {status === 'DELETING' && t('assetItem.tags.deleting')}
    </Box>
  );
}
