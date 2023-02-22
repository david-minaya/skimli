import { Style } from '~/utils/style';

export const style = Style({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 12px 16px 24px',
    '&.MuiDialogTitle-root': {
      fontSize: '18px',
    }
  },
  description: {
    fontSize: '15px'
  },
  cancelButton: {
    color: 'black'
  }
});
