import { Style } from '~/utils/style';

export const style = Style({
  tag: {
    color: 'white',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '100px',
    padding: '2px 8px'
  },
  processing: {
    backgroundColor: '#FFB020'
  },
  unconverted: {
    backgroundColor: '#3551BD'
  },
  converting: {
    backgroundColor: '#FD6B35'
  },
  converted: {
    backgroundColor: 'green.main'
  },
  deleting: {
    backgroundColor: '#D14343'
  }
});