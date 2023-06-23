import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: '72px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: '12px 0px'
  },
  top: {
    width: '100%'
  },
  bottom: {
    width: '100%'
  },
  logo: {
    display: 'block',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    margin: '0px auto 10px'
  },
  profileImage: {
    width: '32px',
    height: '32px'
  }
});
