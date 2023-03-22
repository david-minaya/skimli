import { Style } from '~/utils/style';

export const style = Style({
  container: {
    textAlign: 'center',
    margin: '40px 0px',
    ':first-of-type': {
      marginTop: '20px'
    }
  },
  image: {
    width: '160px'
  }, 
  title: {
    color: '#111827',
    fontSize: '15px',
    fontWeight: 500,
    marginTop: '8px'
  },
  description: {
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '4px'
  }
});
