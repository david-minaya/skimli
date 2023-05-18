import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Asset } from '~/types/assets.type';
import { mergeSx } from '~/utils/style';
import { style } from './status-tag.style';

interface Props {
  status: Asset['status'];
  onClick: () => void;
}

export function StatusTag(props: Props) {

  const { status, onClick } = props;
  const { t } = useTranslation('library');

  return (
    <Box 
      sx={mergeSx(
        style.tag,
        status === 'PROCESSING' && style.processing,
        status === 'UNCONVERTED' && style.unconverted,
        status === 'CONVERTING' && style.converting,
        status === 'CONVERTED' && style.converted,
        status === 'DELETING' && style.deleting,
        status === 'ERRORED' && style.error,
        status === 'NO_CLIPS_FOUND' && style.error,
        status === 'TIMEOUT' && style.error
      )}
      onClick={onClick}>
      {status === 'PROCESSING' && t('assetItem.tags.processing')}
      {status === 'UNCONVERTED' && t('assetItem.tags.unconverted')}
      {status === 'CONVERTING' && t('assetItem.tags.converting')}
      {status === 'CONVERTED' && t('assetItem.tags.converted')}
      {status === 'DELETING' && t('assetItem.tags.deleting')}
      {status === 'ERRORED' && t('assetItem.tags.error')}
      {status === 'NO_CLIPS_FOUND' && t('assetItem.tags.error')}
      {status === 'TIMEOUT' && t('assetItem.tags.timeout')}
    </Box>
  );
}
