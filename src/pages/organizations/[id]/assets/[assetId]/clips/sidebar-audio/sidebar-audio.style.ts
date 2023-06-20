import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  sidebarContent: nestedStyle({
    content: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0px'
    }
  }),
  sidebarUploadFile: {
    margin: '8px 0px'
  },
  searchField: nestedStyle({
    container: {
      margin: '8px 0px'
    }
  }),
  searchResults: {
    color: 'black',
    fontWeight: 500,
    fontSize: '15px',
    textAlign: 'center',
    margin: '12px 4px 4px'
  },
  notFoundResults: {
    color: 'black',
    fontSize: '15px',
    textAlign: 'center',
    margin: '8px 4px 4px'
  },
});
