import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  sidebarContent: nestedStyle({
    container: {
      width: '260px'
    },
    content: {
      padding: '0px 0px 8px'
    }
  })
});
