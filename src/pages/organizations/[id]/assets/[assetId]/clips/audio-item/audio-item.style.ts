import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0px'
  },
  hidden: {
    display: 'none'
  },
  icon: {
    color: 'black'
  },
  details: {
    overflow: 'hidden',
    marginLeft: '8px'
  },
  title: {
    fontSize: '15px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  duration: {
    fontSize: '12px',
    fontVariantNumeric: 'tabular-nums'
  }
});
