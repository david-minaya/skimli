import { Style } from '~/utils/style';

export const style = Style({
  container: {
    display: 'flex',
    alignItems: 'center',
    margin: '40px 0px'
  },
  symbol: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid',
    borderRadius: '50%',
    backgroundColor: 'white'
  },
  symbolSelected: {
    borderColor: 'green.main',
    backgroundColor: 'green.main'
  },
  symbolWarning: {
    borderColor: '#D14343'
  },
  symbolCompleted: {
    borderColor: 'green.main'
  },
  index: {
    fontWeight: 'bold'
  },
  doneIcon: {
    color: 'white'
  },
  warningIcon: {
    color: '#D14343'
  },
  title: {
    fontWeight: 'bold',
    marginLeft: '20px'
  },
  titleSelected: {
    color: 'green.main',
  },
  titleWarning: {
    color: '#D14343'
  },
  titleCompleted: {
    color: 'green.main',
  },
});
