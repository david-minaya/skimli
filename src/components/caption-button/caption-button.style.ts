import { Style } from '~/utils/style';

export const style = Style({
  iconButton: {
    margin: '0px 4px',
  },
  active: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }
  }
});
