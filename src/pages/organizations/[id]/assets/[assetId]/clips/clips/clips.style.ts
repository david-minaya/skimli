import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 4px 8px 8px'
  },
  title: {
    flexShrink: 0,
    fontWeight: 600,
    color: 'black'
  },
  clips: {
    width: 'fit-content',
    flexGrow: 1,
    overflowY: 'auto',
    paddingRight: '4px'
  }
});
