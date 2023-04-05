import { Style } from '~/utils/style';

export const style = Style({
  tag: {
    color: 'white',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'default',
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
    backgroundColor: '#FD6B35',
    cursor: 'pointer'
  },
  converted: {
    backgroundColor: 'green.main',
    cursor: 'pointer'
  },
  deleting: {
    backgroundColor: '#D14343'
  },
  error: {
    backgroundColor: '#D14343',
    cursor: 'pointer'
  }
});
