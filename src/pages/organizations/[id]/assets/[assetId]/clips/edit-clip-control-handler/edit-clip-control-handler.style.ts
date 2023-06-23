import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: 'min-content',
    top: '0px',
    cursor: 'e-resize',
    backgroundColor: 'primary.main',
    zIndex: 2,
    ':hover': {
      backgroundColor: 'primary.light'
    }
  },
  icon: {
    height: '16px',
    width: '12px',
    display: 'block',
    color: 'white',
    transform: 'scale(1.4)'
  },
  time: {
    position: 'absolute',
    top: '0px',
    left: '50%',
    transform: 'translate(-50%, -110%)',
    color: 'white',
    fontSize: '11px',
    fontVariantNumeric: 'tabular-nums',
    backgroundColor: 'black',
    borderRadius: '4px',
    padding: '0px 4px'
  }
});
