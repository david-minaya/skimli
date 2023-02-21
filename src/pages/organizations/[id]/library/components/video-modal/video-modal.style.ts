import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    width: '100%',
    maxWidth: '1200px',
    position: 'relative',
    margin: '40px'
  },
  video: {
    display: 'block',
    borderRadius: '4px',
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    color: 'white',
    cursor: 'pointer'
  },
});
