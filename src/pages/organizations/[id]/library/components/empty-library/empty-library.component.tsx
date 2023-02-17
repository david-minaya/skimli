import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { UploadIcon } from '~/icons/uploadIcon';
import { useUploadFiles } from '~/utils/UploadFilesProvider';
import { style } from './empty-library.style';

interface Props {
  show: boolean;
  onUploadFile: () => void;
}

export function EmptyLibrary(props: Props) {

  const { 
    show,
    onUploadFile 
  } = props;

  const { t } = useTranslation('library');
  const { inProgress } = useUploadFiles();

  if (!show) {
    return null;
  }

  return (
    <Box>
      <Box sx={style.card}>
        <Box>
          <Box sx={style.cardTitle}>{t('cardTitle')}</Box>
          <Box sx={style.cardDescription}>{t('cardDescription')}</Box>
        </Box>
        <OutlinedButton
          title={t('button')}
          icon={UploadIcon}
          disabled={inProgress}
          onClick={onUploadFile}/>
      </Box>
      <Box sx={style.emptyLibrary}>
        <Box
          sx={style.emptyLibraryImage}
          component='img'
          src='/images/empty-library.svg'/>
        <Box sx={style.emptyLibraryTitle}>{t('emptyLibraryTitle')}</Box>
        <Box sx={style.emptyLibraryDescription}>{t`emptyLibraryDescription`}</Box>
      </Box>
    </Box>
  )
}
