import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  sidebarContent: nestedStyle({
    container: {
      width: '260px'
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0px 0px 8px'
    }
  }),
  header: {
    flexShrink: 0,
    padding: '8px'
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'black',
  },
  content: {
    flexGrow: 1,
    overflow: 'auto'
  },
  autoTag: {
    width: 'fit-content',
    color: 'white',
    fontSize: '10px',
    fontWeight: 500,
    textAlign: 'center',
    backgroundColor: '#333333',
    borderRadius: '24px',
    padding: '2px 8px',
    marginTop: '4px'
  },
  uploadedTag: {
    width: 'fit-content',
    color: 'black',
    fontSize: '10px',
    fontWeight: 500,
    textAlign: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: '24px',
    padding: '2px 8px',
    marginTop: '4px'
  }
});
