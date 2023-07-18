import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  expandPanel: nestedStyle({
    content: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0px 12px',
      'div': {
        flexShrink: 0
      }
    }
  }),
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    color: 'black',
    fontSize: '14px',
    fontWeight: 500,
    margin: '16px 0px 4px'
  },
  title: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  duration: {
    flexShrink: 0
  },
  fieldTitle: {
    color: 'black',
    fontSize: '14px',
    fontWeight: 500,
    marginTop: '16px'
  },
  volumeField: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '4px'
  },
  volumeIcon: {
    width: '20px',
    height: '20px'
  },
  slider: {
    height: '8px',
    margin: '0px 8px',
    '& .MuiSlider-thumb:before': {
      boxShadow: 'none'
    },
    '& .MuiSlider-thumb': {
      width: '14px',
      height: '14px',
      border: '2px solid',
      boxShadow: 'none',
      borderColor: 'white'
    }
  },
  textField: nestedStyle({
    container: {
      width: '100%',
      marginTop: '4px'
    }
  }),
  subTitle: {
    color: 'black',
    fontSize: '15px',
    fontWeight: 500,
    textAlign: 'center',
    margin: '24px 0px 0px'
  }
});
