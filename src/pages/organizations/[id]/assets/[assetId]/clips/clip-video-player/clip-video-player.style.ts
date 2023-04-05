import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px'
  },
  video: {
    display: 'block',
    width: '100%',
    flexGrow: 1,
    backgroundColor: 'black'
  },
  controls: {
    height: '40px',
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '0px 4px'
  },
  playButton: {
    color: 'black'
  },
  time: {
    fontSize: '12px',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    marginLeft: '12px',
    marginRight: 'auto'
  },
  volumeOption: {
    marginLeft: '4px',
    marginRight: '8px'
  },
  volumePopup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0px 1px 6px 0px #64748B33'
  },
  slider: {
    width: '8px',
    height: '140px',
    margin: '16px 0px 12px',
    '& .MuiSlider-thumb': {
      width: '16px',
      height: '16px',
      backgroundColor: 'white',
      border: '3px solid',
      borderColor: 'primary.main'
    }
  }
});
