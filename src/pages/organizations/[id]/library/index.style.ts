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
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: 400
  },
  fileInput: {
    display: 'none'
  },
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
  emptyLibrary: {
    textAlign: 'center'
  },
  emptyLibraryImage: {
    width: '460px',
    marginTop: '24px'
  },
  emptyLibraryTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '12px'
  },
  emptyLibraryDescription: {
    maxWidth: '520px',
    fontSize: '15px',
    margin: '12px auto'
  },
  dragArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '57px', // Height of the header
    left: '0px',
    right: '0px',
    bottom: '0px',
    zIndex: '3',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  dragAreaContent: {
    width: '500px',
    height: '168px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    backgroundColor: '#EEEEEE',
    borderRadius: '8px'
  },
  dragAreaImage: {
    width: '60px',
    height: '60px',
    pointerEvents: 'none',
  },
  dragAreaTitle: {
    color: '#6B7280',
    fontSize: '15px',
    fontWeight: '500',
    pointerEvents: 'none',
    marginTop: '12px'
  }
});
