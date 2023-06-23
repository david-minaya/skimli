import { Style } from '~/utils/style';

export const style = Style({
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
    boxShadow: '0px 1px 6px 0px #64748B33',
    zIndex: '2000'
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
