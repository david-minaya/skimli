import { Style } from '~/utils/style';

export const style = Style({
  card: {
    width: '292px',
    flexShrink: 0,
    border: '1px solid #777777',
    borderRadius: '16px',
    margin: '20px'
  },
  cardHighlight: {
    backgroundColor: 'primary.main',
    border: '2px solid',
    borderColor: 'primary.main'
  },
  popular: {
    color: 'white',
    fontWeight: 500,
    textAlign: 'center',
    visibility: 'hidden',
    backgroundColor: 'primary.main',
    borderRadius: '16px 16px 0px 0px',
    padding: '4px 0px'
  },
  visible: {
    visibility: 'visible'
  },
  header: {
    padding: '12px 16px 12px',
    borderBottom: '1px solid #E6E8F0',
    backgroundColor: 'white'
  },
  title: {
    fontWeight: 'bold'
  },
  priceContainer: {
    marginTop: '4px'
  },
  price: {
    fontSize: '32px',
    fontWeight: 'bold'
  },
  timeFrame: {
    color: '#6B7280',
    marginLeft: '4px',
    fontSize: '14px'
  },
  subTitle: {
    color: '#6B7280',
    fontSize: '13px',
    fontWeight: 500,
    marginTop: '4px'
  },
  button: {
    width: '100%',
    border: '2px solid black',
    fontSize: '17px',
    color: 'black',
    fontWeight: 600,
    padding: '4px 20px',
    marginTop: '8px',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)'
    },
    '&.Mui-disabled': {
      borderColor: 'lightgray'
    }
  },
  buttonHighlight: {
    color: 'white',
    backgroundColor: 'primary.main',
    borderColor: 'primary.main',
    ':hover': {
      backgroundColor: 'primary.dark',
      borderColor: 'primary.dark'
    }
  },
  buttonIcon: {
    marginLeft: '8px'
  },
  body: {
    height: '240px',
    padding: '8px 16px',
    backgroundColor: 'white',
    borderRadius: '0px 0px 16px 16px',
  },
  features: {
    position: 'relative',
    marginTop: '8px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    color: '#111827',
    fontWeight: 500,
    fontSize: '14px',
    marginTop: '4px'
  },
  featureIcon: {
    width: '22px',
    height: '22px',
    marginRight: '8px'
  },
  featureHelpIcon: {
    width: '22px',
    height: '22px',
    color: '#777777',
    marginLeft: 'auto',
    paddingLeft: '8px',
    boxSizing: 'content-box'
  }
});
