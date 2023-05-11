import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  sidebarContent: nestedStyle({
    container: {
      width: '260px'
    },
    content: {
      padding: '0px 0px 8px'
    }
  }),
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
