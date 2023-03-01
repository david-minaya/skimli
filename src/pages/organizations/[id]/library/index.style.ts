import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  appBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    backgroundColor: 'backgroundColor.main',
    padding: '12px 16px'
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingTop: '40px',
    paddingBottom: '24px',
    overflow: 'hidden'
  },
  toolbar: {
    height: '36px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: 400
  },
  searchTitle: {
    fontSize: '17px'
  },
  results: {
    fontWeight: 500,
    fontSize: '15px'
  },
  videoContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '24px',
    height: '100%',
    overflow: 'hidden'
  },
  videoTitle: {
    flexShrink: 0,
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    backgroundColor: '#F3F4F6',
    padding: '8px 12px'
  },
  videos: {
    height: '100%',
    flexGrow: 1,
    overflow: 'auto',
    marginTop: '8px'
  },
  hiddenFileInput: {
    display: 'none'
  }
});
