import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '0px',
    right: '0px',
    bottom: '0px',
    cursor: 'pointer',
    zIndex: 1
  },
  thumb: {
    position: 'absolute',
    transform: 'translateX(-50%)',
    pointerEvents: 'all', 
    bottom: '0px',
    color: 'primary.main',
    cursor: 'ew-resize',
    ':hover': {
      color: 'primary.light'
    }
  },
  tag: {
    position: 'absolute',
    top: '0px',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '11px',
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
    cursor: 'ew-resize',
    backgroundColor: 'black',
    borderRadius: '4px',
    padding: '2px 8px'
  },
  line: {
    width: '6px',
    position: 'absolute',
    top: '0px',
    bottom: '0px',
    transform: 'translateX(-50%)',
    cursor: 'ew-resize',
    backgroundColor: 'black',
    borderLeft: '2px solid',
    borderRight: '2px solid',
    borderColor: 'primary.main'
  }
});
