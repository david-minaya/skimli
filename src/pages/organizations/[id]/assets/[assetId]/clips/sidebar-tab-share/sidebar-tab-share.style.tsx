import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: '200px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    flexShrink: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: 'black',
    ':not(:first-of-type)': {
      padding: '12px 8px 4px'
    },
    padding: '8px'
  },
  socialMedia: {
    height: '100px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 32px)',
    gridTemplateRows: 'repeat(2, 32px)',
    justifyContent: 'center',
    alignContent: 'center',
    rowGap: '8px',
    columnGap: '8px',
    flexShrink: 0,
    borderBottom: '1px solid #E6E8F0',
    padding: '0px 8px'
  },
  aspectRatios: {
    flexGrow: 1,
    overflow: 'auto',
    paddingLeft: '8px'
  }
});
