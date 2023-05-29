import { Style } from '~/utils/style';

export const style = Style({
  container: {
    textAlign: 'center',
    margin: '40px 0px',
    ':first-of-type': {
      margin: '20px 0px'
    }
  },
  iphoneFrame: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'white',
    boxSizing: 'content-box',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '3px solid black',
    borderRadius: '12px',
    margin: 'auto'
  },
  landscapeNorth: {
    width: '5px',
    height: '32px', 
    position: 'absolute',
    left: '0px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'black',
    borderRadius: '0px 6px 6px 0px'
  },
  portraitNorth: {
    width: '32px',
    height: '5px', 
    position: 'absolute',
    left: '50%',
    top: '0px',
    transform: 'translateX(-50%)',
    backgroundColor: 'black',
    borderRadius: '0px 0px 6px 6px'
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
