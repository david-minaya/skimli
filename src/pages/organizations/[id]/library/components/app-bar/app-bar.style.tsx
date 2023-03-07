import { Style } from '~/utils/style';

export const style = Style({
  appBar: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    backgroundColor: 'backgroundColor.main',
    padding: '0px 16px'
  },
  left: {
    display: 'flex',
    flex: '1 0',
    justifyContent: 'start'
  },
  center: {
    display: 'flex',
    flex: '1 0',
    justifyContent: 'center'
  },
  right: {
    display: 'flex',
    flex: '1 0',
    justifyContent: 'end'
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold'
  },
  selectedContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  selectedTitle: {
    color: '#333333',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0px 16px'
  },
  selectedCounter: {
    color: '#6B7280',
    fontSize: '15px'
  }
});
