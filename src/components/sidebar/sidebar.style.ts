import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  tabs: {
    width: '52px',
    flexShrink: 0,
    backgroundColor: '#EEEEEE'
  },
  tab: {
    width: '52px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#CCCCCC'
    }
  },
  selected: {
    backgroundColor: 'white',
    transition: 'background-color 100ms',
    ':hover': {
      backgroundColor: 'white'
    }
  }
});
