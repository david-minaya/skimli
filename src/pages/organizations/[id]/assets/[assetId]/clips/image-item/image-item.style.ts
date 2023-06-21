import { Style } from '~/utils/style';

export const style = Style({
  container: {
    margin: '28px 0px'
  },
  image: {
    width: '100%',
    height: '100px',
    objectFit: 'contain'
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: '8px'
  },
  title: {
    fontSize: '15px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
});
