import { Style } from '~/utils/style';

export const style = Style({
  dialog: {
    '& .MuiDialog-paper': {
      minWidth: '300px',
      minHeight: '300px',
      maxWidth: '1000px',
      borderRadius: '8px'
    }
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 8px 8px 20px'
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
    maxWidth: '100%',
    maxHeight: '600px',
    display: 'block',
    margin: 'auto'
  }
});
