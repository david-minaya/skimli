/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {Style} from '~/utils/style';

export const style = Style({
  card: {
    border: '1px solid #FC4603',
  },
  cardLayout: {
    display: 'flex',
    flexDirection: 'column',
    width: '280px',
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    pt: '12px',
    pl: '8px',
  },
  displayName: {
    variant: 'subtitle1',
    align: 'left',
    pl: '8px',
  },
  category: {
    ml: '8px',
  },
  description: {
    pt: '12px',
    pl: '8px',
  },
  descriptionText: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    color: '#333333',
    align: 'left',
  },
  actionsSection: {
    mt: '16px',
    pl: '8px',
  },
  connectedText: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    color: '#333333',
    align: 'left',
  },
  accountSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    pb: '8px',
  },
  accountName: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    color: '#FC4603',
    align: 'left',
    pl: '8px',
  },
  accountAvatar: {
    width: 24,
    height: 24,
  },
  manageButton: {
    ml: '61px',
    border: '2px solid black',
    fontSize: '14px',
    color: 'black',
  },
  button: {
    border: '2px solid black',
    fontSize: '14px',
    color: 'black',
    mb: '8px',
  },
  comingSoon: {
    mb: '8px',
    color: 'primary.main',
  }
});
