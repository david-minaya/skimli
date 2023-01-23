import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    width: 'auto'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center'
  }, 
  button: {
    display: 'block',
    paddingLeft: '40px',
    paddingRight: '40px',
    margin: '32px auto 0px'
  }
});
