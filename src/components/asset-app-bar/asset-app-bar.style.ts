import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    backgroundColor: 'backgroundColor.main',
    padding: '8px'
  },
  center: {
    flexGrow: 1
  },
  right: {
    display: 'flex',
    alignItems: 'center'
  },
  backButton: {
    width: '32px',
    height: '32px',
    padding: '0px',
    margin: '0px 8px'
  },
  title: {
    height: '32px',
    lineHeight: '32px',
    fontSize: '17px',
    fontWeight: 'bold'
  },
  account: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '4px',
    fontSize: '14px'
  },
  folderIcon: {
    display: 'block',
    marginRight: '8px'
  }
});
