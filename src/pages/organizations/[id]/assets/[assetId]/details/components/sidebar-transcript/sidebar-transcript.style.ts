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
  },
  empty: {
    backgroundColor: '#EEEEEE',
    borderRadius: '8px',
    padding: '12px 16px',
    margin: '0px 8px'
  },
  image: {
    width: '60px',
    height: '60px',
    display: 'block',
    margin: '12px auto 20px'
  },
  text: {
    color: '#6B7280',
    margin: '4px',
    textAlign: 'center',
    ':not(:first-of-type)': {
      marginTop: '24px'
    }
  },
  link: {
    color: 'primary.main',
    fontWeight: 500,
    cursor: 'pointer'
  },
  hiddenFileInput: {
    display: 'none'
  }
});
