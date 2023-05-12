import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  audioTrackTitle: {
    fontSize: '14px',
    fontWeight: 500,
    margin: '8px 0px 4px',
    textDecoration: 'underline'
  },
  detailItem: nestedStyle({
    title: {
      minWidth: '84px'
    }
  }),
  iconButton: {
    display: 'flex',
    padding: '0px'
  },
  icon: {
    width: '20px',
    height: '20px',
    display: 'block',
    color: 'rgba(0, 0, 0, 0.7)',
    cursor: 'pointer'
  },
  tooltip: {
    maxWidth: '360px',
    backgroundColor: 'white',
    color: '#555555',
    fontSize: '12px',
    boxShadow: 1,
    padding: '12px'
  }
});
