import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    position: 'absolute',
    bottom: '0px',
    cursor: 'pointer',
    zIndex: 2
  },
  thumb: {
    position: 'absolute',
    transform: 'translateX(-50%)',
    bottom: '0px'
  },
  thumbIcon: {
    display: 'block',
    color: 'primary.main',
    cursor: 'ew-resize',
    marginTop: 'auto',
    ':hover': {
      color: 'primary.light'
    }
  },
  thumbTimecode: {
    color: 'white',
    fontSize: '11px',
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
    cursor: 'ew-resize',
    backgroundColor: 'black',
    borderRadius: '4px',
    padding: '2px 8px'
  },
  thumbTimecodeLine: {
    width: '6px',
    height: '60px',
    cursor: 'ew-resize',
    backgroundColor: 'black',
    borderLeft: '2px solid',
    borderRight: '2px solid',
    borderColor: 'primary.main',
    margin: 'auto'
  }
});
