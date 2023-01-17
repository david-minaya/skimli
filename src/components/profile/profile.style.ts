import { Style } from '~/utils/style';

export const style = Style({
  container: {
    '& .MuiPopover-paper': {
      minWidth: '240px',
      border: 'none',
      borderRadius: '4px'
    }
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 8px 16px'
  },
  image: {
    width: '40px',
    height: '40px',
    marginRight: '12px'
  },
  name: {
    textTransform: 'capitalize',
    color: '#333333'
  },
  email: {
    fontSize: '14px',
    color: '#333333'
  },
  divider: {
    borderBottom: '1px solid #999999',
    margin: '0px 8px'
  },
  options: {
    padding: '12px 8px 12px'
  },
  option: {
    display: 'block',
    padding: '8px',
    color: '#333333',
    fontSize: '16px',
    borderRadius: '2px',
    marginBottom: '2px',
    cursor: 'default',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: '#FEDACC'
    }
  }
});
