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
  assetTitle: {
    color: '#111827',
    fontSize: '15px',
    fontWeight: 500
  },
  selectTitle: {
    color: '#555555',
    fontSize: '12px',
    marginTop: '12px'
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
  tooltip: {
    maxWidth: '280px',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: 2,
    padding: '8px'
  },
  select: {
    width: '340px',
    marginTop: '6px'
  },
  error: {
    color: 'red',
    fontSize: '13px',
    marginTop: '8px'
  },
  button: {
    display: 'block',
    margin: '20px auto 0px'
  }
});
