/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {Style} from '~/utils/style';

export const style = Style({
    container: {
        '& .MuiPopover-paper': {
            minWidth: '240px',
            border: 'none',
            borderRadius: '4px'
        }
    },
    options: {
        padding: '12px 8px 12px'
    },
    link: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px',
        marginTop: '16px'
    },
    linkIcon: {
        width: '17px',
        height: '17px',
        marginLeft: '8px'
    }
});