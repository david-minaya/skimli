import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: '360px'
  },
  title: {
    fontSize: '17px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textField: {
    container: {
      width: '100%'
    }
  },
  emailNotVerified: {
    input: {
      backgroundColor: '#FDF4F4',
      borderColor: '#D14343'
    }
  },
  message: {
    display: 'flex',
    fontSize: '12px',
    color: '#555555',
    marginTop: '8px'
  },
  verifiedIcon: {
    width: '16px',
    height: '16px',
    color: 'green.main',
    marginRight: '8px',
    marginTop: '1px'
  },
  errorIcon: {
    width: '16px',
    height: '16px',
    color: '#D14343',
    marginRight: '8px',
    marginTop: '1.5px'
  },
  button: {
    display: 'block',
    paddingLeft: '40px',
    paddingRight: '40px',
    margin: '36px auto 0px'
  }
});
