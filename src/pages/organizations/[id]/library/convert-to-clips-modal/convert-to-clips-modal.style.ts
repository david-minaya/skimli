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
    marginTop: '16px'
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
  selectCategoryError: {
    color: 'red',
    fontSize: '14px',
    marginTop: '8px'
  },
  uploadFile: {
    width: '340px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '15px',
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    marginTop: '8px',
    padding: '0px 4px 0px 12px'
  },
  uploadFileValue: {
    fontSize: '15px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  uploadFileButton: {
    flexShrink: 0,
    color: '#555555',
    fontSize: '14px',
    userSelect: 'none',
    cursor: 'pointer',
    border: '2px solid #555555',
    borderRadius: '8px',
    padding: '1px 4px',
    ':active': {
      color: 'black',
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }
  },
  uploadFileProgress: {
    color: 'black',
    fontSize: '14px',
    marginTop: '8px'
  },
  uploadFileError: {
    color: 'red',
    fontSize: '14px',
    marginTop: '8px'
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
  },
  hiddenFileInput: {
    display: 'none'
  }
});
