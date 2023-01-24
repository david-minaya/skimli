import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: '200px',
    marginTop: '24px'
  },
  title: {
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
  }
});
