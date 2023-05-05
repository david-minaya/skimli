import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    margin: '4px 0px'
  },
  title: {
    minWidth: '108px',
    fontWeight: 500,
    marginRight: '12px'
  },
  text: {
    color: '#555555',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});
