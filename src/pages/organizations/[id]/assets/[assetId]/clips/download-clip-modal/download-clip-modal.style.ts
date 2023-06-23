import { Style } from '~/utils/style';

export const style = Style({
  dialog: {
    '& .MuiDialog-paper': {
      width: '420px'
    }
  },
  content: {
    width: 'fit-content',
    margin: 'auto'
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 12px 16px 24px',
    '&.MuiDialogTitle-root': {
      fontSize: '16px',
      fontWeight: 'bold'
    }
  },
  selectTitle: {
    color: '#555555',
    fontSize: '12px',
    marginTop: '16px'
  },
  select: {
    width: '340px',
    marginTop: '6px'
  },
  button: {
    display: 'block',
    margin: '40px auto 0px'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: '15px',
    marginTop: '24px'
  }
});
