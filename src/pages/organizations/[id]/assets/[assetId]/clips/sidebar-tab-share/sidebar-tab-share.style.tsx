import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  sidebarContent: nestedStyle({
    content: {
      padding: '0px 0px 0px 8px'
    }
  }),
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    flexShrink: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: 'black',
    padding: '12px 0px 4px'
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
    borderBottom: '1px solid #E6E8F0'
  },
  aspectRatios: {
    flexGrow: 1,
    overflow: 'auto'
  }
});
