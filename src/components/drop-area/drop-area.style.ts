import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '57px', // Height of the header
    left: '0px',
    right: '0px',
    bottom: '0px',
    zIndex: '3',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    width: '500px',
    height: '168px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    backgroundColor: '#EEEEEE',
    borderRadius: '8px'
  },
  image: {
    width: '60px',
    height: '60px',
    pointerEvents: 'none',
  },
  title: {
    color: '#6B7280',
    fontSize: '15px',
    fontWeight: '500',
    pointerEvents: 'none',
    marginTop: '12px'
  }
});
