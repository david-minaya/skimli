import { Style } from '~/utils/style';

export const style = Style({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  title: {
    flexShrink: 0,
    fontSize: '22px',
    fontWeight: 'bold',
    backgroundColor: '#F6F6F6',
    padding: '12px 16px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingTop: '40px',
    paddingBottom: '24px',
    overflow: 'hidden'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    ':not(:first-of-type)': {
      marginTop: '32px',
    }
  },
  sectionTitleIcon: {
    width: '22px',
    height: '22px',
    marginRight: '8px'
  },
  sectionSubTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
    marginTop: '16px'
  },
  cards: {
    display: 'flex',
    marginTop: '12px'
  },
  card: {
    flex: '1 0',
    backgroundColor: 'backgroundColor.main',
    borderRadius: '8px',
    padding: '16px',
    ':last-of-type': {
      marginLeft: '12px'
    }
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
  },
  cardSubTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#6B7280',
    marginTop: '12px'
  },
  cardDescription: {
    fontSize: '15px',
    color: '#6B7280',
    fontWeight: '400',
    marginTop: '12px'
  },
  button: {
    width: '100%',
    marginTop: '20px'
  },
  convertionsCounter: {
    marginTop: '20px'
  }
});
