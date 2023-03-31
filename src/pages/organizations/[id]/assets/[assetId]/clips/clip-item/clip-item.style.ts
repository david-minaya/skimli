import { Style } from '~/utils/style';

export const style = Style({
  container: {
    width: 'fit-content',
    padding: '2px',
    transition: '0.1s',
    border: '3px solid transparent',
    borderRadius: '8px',
    margin: '8px 0px 20px'
  },
  selected: {
    border: '3px solid',
    borderColor: 'primary.main',
  },
  imageContainer: {
    position: 'relative'
  },
  image: {
    width: '172px',
    height: '100px',
    display: 'block',
    backgroundColor: 'lightgray',
    borderRadius: '2px'
  },
  duration: {
    position: 'absolute',
    right: '4px',
    bottom: '4px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '300',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
    padding: '0px 4px'
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    marginTop: '8px'
  },
  title: {
    color: 'black',
    fontWeight: 500,
    fontSize: '14px'
  },
  time: {
    color: '#6B7280',
    fontSize: '13px',
    marginTop: '2px'
  },
  tag: {
    color: 'white',
    fontSize: '16px',
    backgroundColor: 'black',
    borderRadius: '4px',
    padding: '1px 6px',
    margin: '2px'
  }
});
