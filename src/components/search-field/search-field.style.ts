import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    padding: '2px 2px 2px 8px'
  },
  focus: {
    borderColor: 'primary.main'
  },
  icon: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
    color: '#555555'
  },
  input: {
    flexGrow: 1,
    fontSize: '15px',
    padding: '0px 8px'
  }
});
