import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    alignItems: 'start',
    padding: '8px'
  },
  active: {
    backgroundColor: '#FEDACC'
  },
  time: {
    color: 'white',
    fontSize: '13px',
    fontVariantNumeric: 'tabular-nums',
    backgroundColor: '#FC460380',
    borderRadius: '4px',
    padding: '0px 2px',
    marginTop: '1px'
  },
  text: {
    color: '#333333',
    fontSize: '14px',
    fontWeight: 500,
    marginLeft: '12px'
  }
});
