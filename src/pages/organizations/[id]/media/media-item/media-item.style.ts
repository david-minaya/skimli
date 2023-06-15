import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '156px',
    display: 'flex',
    alignItems: 'center',
    padding: '28px 8px 28px 0px',
    borderBottom: '1px solid #E6E8F0',
    ':last-of-type': {
      borderBottom: 'none'
    }
  },
  containerSelected: {
    backgroundColor: '#FEF3EF'
  },
  checkBox: {
    visibility: 'hidden',
    marginRight: '8px'
  },
  checkBoxVisible: {
    visibility: 'visible'
  },
  image: {
    width: '160px',
    height: '100px',
    objectFit: 'contain',
    flexShrink: 0,
    cursor: 'pointer'
  },
  audioContainer: {
    width: '160px',
    height: '100px',
    position: 'relative',
    flexShrink: 0
  },
  audioImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  playContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '0px',
    left: '0px',
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playIcon: {
    width: '32px',
    height: '32px',
    color: 'white'
  },
  progress: {
    width: '100%',
    position: 'absolute',
    bottom: '0px'
  },
  info: {
    flexGrow: 1,
    padding: '20px',
    overflow: 'hidden'
  },
  title: {
    color: '#111827',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  date: {
    color: '#6B7280',
    fontSize: '13px',
    marginTop: '4px'
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0
  },
  notAttached: {
    backgroundColor: '#999999'
  },
  menuOption: {
    color: 'black',
    marginLeft: '8px'
  }
});
