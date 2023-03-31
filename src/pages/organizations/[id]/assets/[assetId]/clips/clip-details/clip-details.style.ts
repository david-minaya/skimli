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
    container: {
      width: '100%',
      margin: '0px'
    }
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
