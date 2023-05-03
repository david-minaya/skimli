import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '72px',
    position: 'relative',
    margin: '0px 8px'
  },
  control: {
    height: '48px',
    position: 'absolute',
    bottom: '0px',
    border: '3px solid red'
  },
  leftHandler: {
    left: '0px',
    transform: 'translate(-100%, -100%)',
    borderRadius: '8px 8px 0px 8px'
  },
  rightHandler: {
    right: '0px',
    transform: 'translate(100%, -100%)',
    borderRadius: '8px 8px 8px 0px'
  },
  skipThumb: {
    height: '72px',
    position: 'absolute',
    bottom: '0px',
    transform: 'translateX(-50%)',
    pointerEvents: 'none'
  },
  skipThumbTimecode: {
    position: 'absolute',
    transform: 'translateX(-50%)',
    top: '0px',
    color: 'white',
    fontSize: '11px',
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
    backgroundColor: 'black',
    borderRadius: '4px',
    padding: '0px 4px',
    zIndex: '2'
  },
  skipThumbLine: {
    width: '2px',
    height: '100%',
    backgroundColor: 'black',
    boxShadow: '0px 0px 2px 2px white',
    margin: 'auto'
  }
});
