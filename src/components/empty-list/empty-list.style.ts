import { Style } from '~/utils/style';

export const style = Style({
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'backgroundColor.main',
    borderRadius: '8px',
    padding: '14px',
    marginTop: '24px'
  },
  cardTitle: {
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  cardDescription: {
    color: '#6B7280',
    fontSize: '14px',
    marginTop: '10px'
  },
  emptyList: {
    textAlign: 'center'
  },
  emptyListImage: {
    width: '460px',
    marginTop: '24px'
  },
  emptyListTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '12px'
  },
  emptyListDescription: {
    maxWidth: '520px',
    fontSize: '15px',
    margin: '12px auto'
  }
});
