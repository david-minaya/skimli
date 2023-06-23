import { Box } from '@mui/system';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { UploadIcon } from '~/icons/uploadIcon';
import { style } from './empty-list.style';

interface Props {
  show: boolean;
  image: string;
  title: string;
  description: string;
  cardTitle: string;
  cardDescription: string;
  button: string;
  disableButton: boolean;
  onUploadFile: () => void;
}

export function EmptyList(props: Props) {

  const { 
    show,
    image,
    title,
    description,
    cardTitle,
    cardDescription,
    button,
    disableButton,
    onUploadFile 
  } = props;

  if (!show) {
    return null;
  }

  return (
    <Box>
      <Box sx={style.card}>
        <Box>
          <Box sx={style.cardTitle}>{cardTitle}</Box>
          <Box sx={style.cardDescription}>{cardDescription}</Box>
        </Box>
        <OutlinedButton
          title={button}
          icon={UploadIcon}
          disabled={disableButton}
          onClick={onUploadFile}/>
      </Box>
      <Box sx={style.emptyList}>
        <Box
          sx={style.emptyListImage}
          component='img'
          src={image}/>
        <Box sx={style.emptyListTitle}>{title}</Box>
        <Box sx={style.emptyListDescription}>{description}</Box>
      </Box>
    </Box>
  );
}
