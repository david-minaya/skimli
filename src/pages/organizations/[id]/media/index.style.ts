import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
  filesQuantity: {
    fontWeight: 500,
    fontSize: '15px'
  },
  results: {
    fontWeight: 500,
    fontSize: '15px'
  },
  assetsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '24px',
    height: '100%',
    overflow: 'hidden'
  },
  assetTitle: {
    flexShrink: 0,
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    backgroundColor: '#F3F4F6',
    padding: '8px 12px'
  },
  assets: {
    height: '100%',
    flexGrow: 1,
    overflow: 'auto',
    marginTop: '8px'
  },
  hiddenFileInput: {
    display: 'none'
  }
});
