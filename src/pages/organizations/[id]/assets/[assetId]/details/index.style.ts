import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden'
  },
  centerContainer: {
    flexGrow: 1,
    backgroundColor: 'backgroundColor.main'
  },
  center: {
    maxWidth: '680px',
    margin: '0px auto',
    padding: '0px 24px 24px'
  },
  videoContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  video: {
    display: 'block',
    width: '100%',
    flexGrow: 1,
    backgroundColor: 'black'
  },
  controls: {
    height: '40px',
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '0px 4px'
  },
  time: {
    marginRight: 'auto'
  },
  dateContainer: {
    padding: '12px 0px',
    margin: '0px 12px',
    borderBottom: '1px solid #E6E8F0'
  },
  dateTitle: {
    fontSize: '14px',
    color: '#6B7280'
  },
  date: {
    color: '#111827',
    fontSize: '15px',
    fontWeight: 500,
    marginTop: '8px'
  }
});
