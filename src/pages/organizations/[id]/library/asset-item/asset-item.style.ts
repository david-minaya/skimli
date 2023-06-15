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
  loading: {
    width: '160px',
    height: '92px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  processingIcon: {
    width: '60px',
    height: '60px',
    transform: 'scaleX(-1)',
    animation: '3s linear infinite spin',
    '@keyframes spin': {
      to: {
        transform: 'scaleX(-1) rotate(-360deg)'
      }
    },
    '& path': {
      strokeWidth: '1.1'
    }
  },
  imageContainer: {
    width: '176px',
    height: '100px',
    position: 'relative',
    flexShrink: 0
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: '#EEEEEE'
  },
  duration: {
    position: 'absolute',
    right: '8px',
    bottom: '8px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '300',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
    padding: '0px 4px'
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
  PROCESSING: {
    backgroundColor: '#FFB020'
  },
  UNCONVERTED: {
    backgroundColor: '#3551BD'
  },
  CONVERTING: {
    backgroundColor: '#FD6B35',
    cursor: 'pointer'
  },
  CONVERTED: {
    backgroundColor: 'green.main',
    cursor: 'pointer'
  },
  DELETING: {
    backgroundColor: '#D14343'
  },
  ERRORED: {
    backgroundColor: '#D14343',
    cursor: 'pointer'
  },
  NO_CLIPS_FOUND: {
    backgroundColor: '#D14343',
    cursor: 'pointer'
  },
  TIMEOUT: {
    backgroundColor: '#D14343',
    cursor: 'pointer'
  },
  processingTagIcon: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
    transform: 'scaleX(-1)',
    animation: '2s linear infinite spin',
    '@keyframes spin': {
      to: {
        transform: 'scaleX(-1) rotate(-360deg)'
      }
    }
  },
  menuOption: {
    color: 'black',
    marginLeft: '8px'
  }
});
