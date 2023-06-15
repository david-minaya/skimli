import { Style } from '~/utils/style';

export const style = Style({
  dialog: {
    '& .MuiDialog-paper': {
      maxWidth: '1000px',
      height: '800px',
      borderRadius: '8px'
    }
  },
  content: {
    padding: '20px'
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 12px 16px 24px'
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  iconButton: {
    display: 'inline-flex',
    marginLeft: '4px',
    padding: '0px'
  },
  icon: {
    width: '16px',
    height: '16px'
  },
  image: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'contain',
    margin: 'auto'
  }
});
