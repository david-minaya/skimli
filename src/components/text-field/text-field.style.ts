import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: '200px',
    marginTop: '24px'
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    fontSize: '15px',
    backgroundColor: 'white',
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    padding: '4px 8px',
    '& .MuiInputBase-input': {
      padding: '0px'
    },
  },
  focus: {
    borderColor: 'primary.main'
  },
  errorMessage: {
    fontSize: '12px',
    color: 'red',
    fontWeight: 500,
    margin: '4px 2px 0px'
  },
});
