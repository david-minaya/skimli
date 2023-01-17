import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    flexShrink: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333333'
  },
  tableContainer: {
    flexGrow: 1,
    marginTop: '16px'
  },
  tableHeader: {
    backgroundColor: '#F3F4F6'
  },
  th: {
    fontSize: '12px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderBottom: 'none'
  },
  td: {
    borderBottom: 'none'
  },
  icon: {
    width: '36px',
    height: '36px',
    display: 'block',
    margin: 'auto'
  },
  userAgent: {
    fontWeight: 'bold'
  },
  loggedIn: {
    color: 'white',
    fontSize: '10px',
    textAlign: 'center',
    backgroundColor: '#14B8A6',
    borderRadius: '12px',
    padding: '2px 4px'
  },
  loggedOut: {
    color: 'white',
    fontSize: '10px',
    textAlign: 'center',
    backgroundColor: '#999999',
    borderRadius: '12px',
    padding: '2px 4px'
  }
});
