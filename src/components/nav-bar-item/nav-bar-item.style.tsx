import { Style } from '~/utils/style';

export const style = Style({
  option: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 0px',
    ':hover': {
      backgroundColor: '#FEDACC'
    },
    ':active': {
      backgroundColor: '#FEDACC'
    }
  },
  optionIcon: {
    width: '28px',
    height: '28px'
  },
  tooltip: {
    backgroundColor: 'white',
    color: 'black',
    fontWeight: 'normal',
    fontSize: '12px',
    boxShadow: '0px 1px 3px lightgray',
    borderRadius: '4px'
  }
});
