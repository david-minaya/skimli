import { Style } from '~/utils/style';

export const style = Style({
  button: {
    width: 'auto',
    border: '2px solid black',
    fontSize: '12px',
    color: 'black',
    fontWeight: 600,
    padding: '4px 16px',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)'
    },
    '&.Mui-disabled': {
      borderColor: 'lightgray'
    }
  },
  icon: {
    width: '20px',
    height: '20px',
    marginRight: '8px'
  }
});
