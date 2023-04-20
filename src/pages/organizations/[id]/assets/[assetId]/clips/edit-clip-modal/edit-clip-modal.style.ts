import { Style } from '~/utils/style';

export const style = Style({
  dialog: {
    '& .MuiDialog-paper': {
      width: '100%',
      height: 'calc(100% - 64px)',
      maxWidth: '1000px',
      maxHeight: '800px',
      borderRadius: '8px',
    }
  },
  dialogContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '0px'
  },
  videoContainer: {
    width: '100%',
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden'
  },
  video: {
    width: '100%',
    height: '100%',
    display: 'block',
    backgroundColor: 'black'
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    display: 'block',
    position: 'absolute',
    top: '0px',
    visibility: 'hidden'
  },
  controlsContainer: {
    flexShrink: 0,
    overflow: 'hidden',
    padding: '4px 16px'
  },
  controls: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  horizontalSpace: {
    flexGrow: 1,
    height: '100%'
  },
  inputContainer: {
    maxWidth: '500px',
    margin: '24px 0px'
  },
  inputTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px'
  },
  input: {
    width: '100%',
    fontSize: '15px',
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    padding: '4px 8px',
    marginTop: '4px',
    '& .MuiInputBase-input': {
      padding: '0px'
    }
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 8px 12px'
  },
  resetButton: {
    color: 'black',
    fontSize: '14px'
  },
  cancelButton: {
    margin: '0px 12px 0px auto'
  }
});
