import { Style } from '~/utils/style';

export const style = Style({
  popup: {
    width: '460px',
    position: 'absolute',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    overflow: 'hidden'
  },
  linearProgress: {
    height: '6px'
  },
  content: {
    padding: '8px 8px 4px 16px',
    color: '#111827'
  },
  percent: {
    fontSize: '14px',
    fontVariantNumeric: 'tabular-nums',
    marginBottom: '2px'
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progress: {
    fontSize: '14px',
    fontVariantNumeric: 'tabular-nums'
  },
  cancelButton: {
    width: '28px',
    height: '28px'
  },
  cancelIcon: {
    width: '20px',
    height: '20px',
    color: 'black'
  }
});
