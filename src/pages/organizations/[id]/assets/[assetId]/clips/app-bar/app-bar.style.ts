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
  titleContainer: {
    height: '32px',
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: '17px',
    fontWeight: 'bold'
  },
  titleInput: {
    container: {
      margin: '0px 12px',
    },
    input: {
      height: '28px',
      backgroundColor: 'white',
      margin: '0px'
    }
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
