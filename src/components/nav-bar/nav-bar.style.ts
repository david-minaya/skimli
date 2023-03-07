import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: '72px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: '12px 0px'
  },
  options: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logo: {
    display: 'block',
    width: '40px',
    height: '40px',
    cursor: 'pointer'
  },
  linkOption: {
    display: 'block',
    width: '100%'
  },
  option: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 0px',
    marginTop: '12px',
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
  profileImage: {
    width: '32px',
    height: '32px'
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
