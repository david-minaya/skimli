import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  container: {
    width: 'min-content',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 4px 8px 8px'
  },
  title: {
    flexShrink: 0,
    fontWeight: 600,
    color: 'black'
  },
  select: {
    flexShrink: 0,
    fontWeight: 600,
    color: 'black',
    border: 'none',
    '& .MuiSelect-select.MuiSelect-outlined': {
      padding: '0px 0px 8px 0px'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '& .MuiSelect-icon': {
      color: 'black',
      top: '0px',
      right: '0px'
    }
  },
  searchField: nestedStyle({
    container: {
      margin: '8px 0px'
    }
  }),
  counter: {
    color: 'black',
    fontWeight: 500,
    fontSize: '15px',
    textAlign: 'center',
    margin: '4px'
  },
  clips: {
    width: 'fit-content',
    flexGrow: 1,
    overflowY: 'auto',
    paddingRight: '4px'
  }
});
