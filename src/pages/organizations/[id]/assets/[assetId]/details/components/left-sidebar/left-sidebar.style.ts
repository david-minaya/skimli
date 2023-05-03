import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: '208px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    padding: '8px'
  },
  select: {
    width: '100%',
    fontWeight: 600,
    color: 'black',
    border: 'none',
    '& .MuiSelect-select.MuiSelect-outlined': {
      padding: '0px 0px 8px 0px'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '& .MuiSelect-icon': {
      color: 'black',
      top: '0px',
      right: '0px'
    }
  },
  title: {
    color: 'black',
    fontWeight: 500,
    fontSize: '14px',
    textAlign: 'center',
    margin: '8px 4px 4px'
  },
  asset: {
    width: '172px',
    height: '100px',
    display: 'block',
    transition: '0.1s',
    backgroundColor: 'white',
    border: '3px solid',
    borderColor: 'primary.main',
    borderRadius: '8px',
    padding: '2px',
    margin: '8px auto',
  },
  mediasTitle: {
    color: 'black',
    fontWeight: 500,
    fontSize: '14px',
    textAlign: 'center',
    margin: '40px 4px 4px'
  }
});
