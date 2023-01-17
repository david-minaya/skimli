import { Style } from '~/utils/style';

export const style = Style({
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333333'
  },
  info: {
    display: 'flex',
    marginTop: '16px',
    alignItems: 'center'
  },
  image: {
    width: '80px',
    height: '80px',
    borderRadius: '50%'
  },
  details: {
    marginLeft: '40px',
    fontSize: '14px',
    '& *:not(:first-of-type)': {
      marginTop: '4px'
    }
  },
  link: {
    display: 'block',
    color: 'primary.main',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    marginTop: '4px'
  },
  inputContainer: {
    margin: '24px 0px'
  },
  inputTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px'
  },
  input: {
    width: '100%',
    fontSize: '15px',
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    padding: '4px 8px',
    marginTop: '4px',
    '& .MuiInputBase-input': {
      padding: '0px'
    }
  },
  nameInput: {
    '& .MuiInputBase-input': {
      textTransform: 'capitalize'
    }
  },
  alert: {
    width: '100%'
  },
  resetPasswordMessage: {
    color: '#14B8A6',
    fontSize: '14px',
    marginTop: '8px'
  }
});
