import { autocompleteClasses } from '@mui/material';
import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden'
  },
  content: {
    height: '100%',
    flexGrow: 1,
    position: 'relative',
    overflow: 'auto'
  }
});
