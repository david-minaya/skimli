import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  title: {
    flexShrink: 0,
    fontSize: '22px',
    fontWeight: 'bold',
    backgroundColor: '#F6F6F6',
    padding: '12px 16px',
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden'
  },
  tabContent: {
    width: '200px', 
    padding: '8px', 
    fontWeight: 600, 
    fontSize: '15px'
  }
});
