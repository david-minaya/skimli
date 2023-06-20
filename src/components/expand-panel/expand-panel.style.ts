import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    flexDirection: 'column',
    transition: '240ms ease-out'
  },
  containerExpanded: {
    flexGrow: 1
  },
  header: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 8px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
  },
  icon: {
    width: '22px',
    height: '22px',
    transform: 'scale(0.9)',
    transition: '300ms'
  },
  iconExpanded: {
    transform: 'scale(0.95) rotateX(180deg)'
  },
  content: {
    height: '0px',
    flexGrow: 1,
    overflow: 'auto',
    padding: '0px 8px'
  }
});
