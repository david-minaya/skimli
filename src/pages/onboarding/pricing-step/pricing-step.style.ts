import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    overflow: 'auto'
  },
  content: {
    width: 'auto',
    margin: 'auto'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  plans: {
    display: 'flex',
    marginTop: '24px'
  },
  link: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    marginTop: '16px'
  },
  linkIcon: {
    width: '17px',
    height: '17px',
    marginLeft: '8px'
  }
});
