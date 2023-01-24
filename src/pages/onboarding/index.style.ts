import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex'
  },
  steps: {
    display: 'flex',
    flexShrink: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    padding: '0px 48px'
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden'
  }
});
