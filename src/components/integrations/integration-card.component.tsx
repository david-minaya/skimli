/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */


import {UserIntegration} from "~/graphqls/schema/integrations.type";
import {Avatar, Box, Button, Chip, Grid, Paper, Typography} from '@mui/material';
import {AccountCircle} from "@mui/icons-material";
import {style} from "./integration-card.style";
import {IntegrationCardContent} from '~/graphqls/contentful/types/integrationCardContent';
import {useTranslation} from 'next-i18next';

interface Props {
    integration?: UserIntegration;
    cardContent?: IntegrationCardContent;
    isCurrent: boolean;
    isAvailable: boolean;
    isUpgradeRequired: boolean;
    isComingSoon: boolean;
}

export function IntegrationCard(props: Props) {
    const {
        integration,
        cardContent,
        isCurrent,
        isAvailable,
        isUpgradeRequired,
        isComingSoon,
    } = props;

    const { t } = useTranslation('integrations');

    return (
        <Paper variant="outlined" sx={style.card}>
            <Grid container sx={style.cardLayout}>
                <Grid item sx={style.cardHeader}>
                    <Avatar alt={cardContent?.logo.title} src={cardContent?.logo.url}/>
                    <Typography sx={style.displayName}>{cardContent?.displayName}</Typography>
                    <Chip sx={style.category}
                          size="small"
                          label={cardContent?.category}/>
                </Grid>
                <Grid item sx={style.description}>
                    <Typography sx={style.descriptionText}>{cardContent?.description}</Typography>
                </Grid>
                <Grid item sx={style.actionsSection}>
                    {isCurrent &&
                        <Box>
                            <Typography sx={style.connectedText}>{t('connectedAccountText')}</Typography>
                            <Box sx={style.accountSection}>
                                <Avatar sx={style.accountAvatar}>
                                    <AccountCircle/>
                                </Avatar>
                                <Typography sx={style.accountName}>Account name</Typography>
                                <Button sx={style.manageButton}>{t('manageButton')}</Button>
                            </Box>
                        </Box>
                    }
                    {isAvailable &&
                        <Button sx={style.button}>{t('addButton')}</Button>
                    }
                    {isUpgradeRequired &&
                        <Button sx={style.button}>{t('upgradeButton')}</Button>
                    }
                    {isComingSoon &&
                        <Chip
                            sx={style.comingSoon}
                            variant="outlined"
                            size="small"
                            label={t('comingSoonChip')}/>
                    }
                </Grid>
            </Grid>
        </Paper>
    );
}
