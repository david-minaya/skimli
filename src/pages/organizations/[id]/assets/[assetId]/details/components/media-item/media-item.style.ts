import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    alignItems: 'start',
    overflow: 'hidden',
    padding: '8px'
  },
  icon: {
    marginTop: '2px'
  },
  details: {
    marginLeft: '8px'
  },
  title: {
    fontSize: '16px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  date: {
    fontSize: '12px'
  }
});
