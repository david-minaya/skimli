/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {Style} from '~/utils/style';

export const style = Style({
    page: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        overflowY: 'auto',
    },
    pageTitle: {
        flexShrink: 0,
        fontSize: '22px',
        fontWeight: 'bold',
        backgroundColor: '#F6F6F6',
        padding: '12px 16px',
    },
    content: {
        mt: '56px',
        mb: '12px',
    },
    layout: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    pageHeadline: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '24px',
        color: '#333333',
        align: 'left',
    },
    pageDescription: {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        color: '#333333',
        align: 'left',
        mt: '8px',
    },
    section: {
        my: '16px',
    },
    sectionTitle: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '16px',
        color: '#333333',
        mb: '16px',
    },
    cardsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '36px',
    }
});
