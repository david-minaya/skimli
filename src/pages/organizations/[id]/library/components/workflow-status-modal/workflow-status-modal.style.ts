import { Style, nestedStyle } from '~/utils/style';

export const style = Style({
  dialog: {
    '& .MuiDialog-paper': {
      width: '560px',
      borderRadius: '8px'
    }
  },
  content: {
    padding: '40px'
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 12px 16px 24px',
    '&.MuiDialogTitle-root': {
      fontSize: '16px',
      fontWeight: 'bold'
    }
  },
  iconButton: {
    display: 'inline-flex',
    marginLeft: '4px',
    padding: '0px'
  },
  icon: {
    width: '16px',
    height: '16px'
  },
  assetIdContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  assetIdTitle: {
    color: '#111827',
    fontWeight: 500,
    fontSize: '15px'
  },
  assetId: {
    color: '#111827',
    fontSize: '12px'
  },
  sectionTitle: {
    color: '#555555',
    fontSize: '12px',
    margin: '12px 0px 8px'
  },
  sectionContent: {
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    padding: '0px 8px'
  },
  audioTrackTitle: {
    fontSize: '14px',
    fontWeight: 500,
    margin: '8px 0px 4px',
    textDecoration: 'underline'
  },
  itemTag: nestedStyle({
    text: {
      backgroundColor: '#FEDACC'
    }
  }),
  itemElapsedTime: nestedStyle({
    text: {
      color: 'green.main'
    }
  })
});
