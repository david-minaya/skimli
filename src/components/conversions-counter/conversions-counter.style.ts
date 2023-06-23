import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    justifyContent: 'center',
    color: 'black',
    fontWeight: '500',
    fontSize: '14px',
    padding: '6px 0px'
  },
  iconButton: {
    display: 'flex',
    marginRight: '8px',
    padding: '0px'
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  tooltip: {
    maxWidth: '360px',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: 1,
    padding: '8px'
  }
});
