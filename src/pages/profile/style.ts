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
    flexDirection: 'column',
    flexGrow: 1,
    paddingTop: '40px',
    paddingBottom: '24px',
    overflow: 'hidden'
  },
  divider: {
    margin: '16px 0px 0px'
  },
  tabList: {
    minHeight: 'initial',
    flexShrink: 0,
    '& .MuiTabs-indicator': {
      display: 'none'
    }
  },
  tab: {
    minHeight: 'initial',
    minWidth: 'initial',
    textTransform: 'none',
    color: '#555555',
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '6px 12px',
    margin: '4px 12px',
    '&.Mui-selected': {
      backgroundColor: '#EEEEEE',
      color: '#555555'
    },
    ':first-of-type': {
      marginLeft: '0px'
    }
  },
  tabPanel: {
    flexGrow: 1,
    padding: '12px 0px',
    overflow: 'hidden'
  }
});
