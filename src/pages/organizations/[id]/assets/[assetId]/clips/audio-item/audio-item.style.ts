import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 2px',
    cursor: 'default',
    borderRadius: '4px',
    margin: '4px 0px'
  },
  hover: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  selected: {
    backgroundColor: '#FEDACC80'
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
  },
  iconButton: {
    color: 'black',
    margin: '0px 2px 0px 4px'
  }
});
