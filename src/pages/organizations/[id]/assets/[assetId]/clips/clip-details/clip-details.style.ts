import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: 'backgroundColor.main'
  },
  toolbar: {
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: 'white',
    padding: '0px 12px'
  },
  addButton: {
    marginRight: '8px'
  },
  content: {
    flexGrow: 1,
    overflow: 'auto'
  },
  center: {
    maxWidth: '680px',
    margin: '24px auto 0px',
    padding: '0px 24px 24px'
  },
  titleInput: {
    display: '-webkit-box',
    color: 'black',
    fontWeight: 500,
    fontSize: '15px',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  videoContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px'
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
  info: {
    display: 'flex',
    alignItems: 'end',
    padding: '12px 0px',
    margin: '0px 12px',
    borderBottom: '1px solid #E6E8F0'
  },
  dateContainer: {
    flexGrow: 1
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
  },
  resetButton: {
    marginRight: '8px'
  }
});
