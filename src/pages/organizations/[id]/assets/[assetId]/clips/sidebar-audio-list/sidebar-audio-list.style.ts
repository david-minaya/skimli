import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  expandPanel: nestedStyle({
    content: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
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
  audioList: {
    flexGrow: 1,
    overflow: 'auto'
  }
});
