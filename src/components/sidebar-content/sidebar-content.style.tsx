import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    flexGrow: 1
  },
  title: {
    flexShrink: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: 'black',
    padding: '8px'
  },
  content: {
    flexGrow: 1,
    padding: '0px 8px 8px',
    overflow: 'auto'
  }
});
