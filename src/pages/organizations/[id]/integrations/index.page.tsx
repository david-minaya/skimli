/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {Main} from "~/components/main/main.component";
import {ProtectedRoute} from "../protected-route/protected-route.component";
import {Box, Container, Grid, Typography} from "@mui/material";
import {style} from "./index.style";
import {useGetUserIntegrations} from "~/graphqls/useGetUserIntegrations";
import {IntegrationCodeType, UserIntegration} from "~/graphqls/schema/integrations.type";
import {IntegrationCard} from "~/components/integrations/integration-card.component";
import {useEffect, useState} from "react";
import {useGetIntegrationsPageContent} from '~/graphqls/contentful/useGetIntegrationsPageContent';
import {IntegrationCardContent} from '~/graphqls/contentful/types/integrationCardContent';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function Integrations() {
    const { t } = useTranslation('integrations');
    // Get CMS data integrations
    const getIntegrationsPageContent = useGetIntegrationsPageContent();
    const comingSoonIntegrationsContent = getIntegrationsPageContent?.comingSoon;
    const availableNowIntegrationsContent = getIntegrationsPageContent?.availableNow;

    // Get User API data for integrations
    const getUserIntegrations = useGetUserIntegrations();

    const [currentIntegrations, setCurrentIntegrations] = useState<
        UserIntegration[]
    >([]);
    const [availableIntegrations, setAvailableIntegrations] = useState<
        UserIntegration[]
    >([]);
    const [upgradeRequiredIntegrations, setUpgradeRequiredIntegrations] =
        useState<UserIntegration[]>([]);


    useEffect(() => {
        (async () => {
            const {
                currentIntegrations: current,
                availableIntegrations: available,
                upgradeRequiredIntegrations: upgrade,
            } = await getUserIntegrations();
            setCurrentIntegrations(current);
            setAvailableIntegrations(available);
            setUpgradeRequiredIntegrations(upgrade);
        })();
    }, []);

    return (
        <Main>
            <Box sx={style.page}>
                <Box sx={style.pageTitle}>{t('pageTitle')}</Box>
                <Container sx={style.content} maxWidth="lg">
                    <Grid container sx={style.layout}>
                        <Grid item>
                            <Typography sx={style.pageHeadline}>{t('pageSubtitle')}</Typography>
                            <Typography sx={style.pageDescription}>
                                {t('pageDescription')}
                            </Typography>
                        </Grid>
                        {currentIntegrations.length !== 0 && (
                            <Grid item sx={style.section}>
                                <Typography align="left" sx={style.sectionTitle}>
                                    {t('currentSectionTitle')}
                                </Typography>
                                <Grid container sx={style.cardsContainer}>
                                    {currentIntegrations.map((integration: UserIntegration) => (
                                        <Grid item key={integration.code}>
                                            <IntegrationCard
                                                integration={integration}
                                                cardContent={availableNowIntegrationsContent?.find(content => content.integrationCode === IntegrationCodeType[integration.code])}
                                                isCurrent={true}
                                                isAvailable={false}
                                                isUpgradeRequired={false}
                                                isComingSoon={false}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        )}
                        {availableIntegrations.length !== 0 && (
                            <Grid item sx={style.section}>
                                <Typography align="left" sx={style.sectionTitle}>
                                    {t('availableSectionTitle')}
                                </Typography>
                                <Grid container sx={style.cardsContainer}>
                                    {availableIntegrations.map((integration: UserIntegration) => (
                                        <Grid item key={integration.code}>
                                            <IntegrationCard
                                                integration={integration}
                                                cardContent={availableNowIntegrationsContent?.find(content => content.integrationCode === IntegrationCodeType[integration.code])}
                                                isCurrent={false}
                                                isAvailable={true}
                                                isUpgradeRequired={false}
                                                isComingSoon={false}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        )}
                        {upgradeRequiredIntegrations.length !== 0 && (
                            <Grid item sx={style.section}>
                                <Typography align="left" sx={style.sectionTitle}>
                                    {t('upgradeRequiredSectionTitle')}
                                </Typography>
                                <Grid container sx={style.cardsContainer}>
                                    {upgradeRequiredIntegrations.map(
                                        (integration: UserIntegration) => (
                                            <Grid item key={integration.code}>
                                                <IntegrationCard
                                                    integration={integration}
                                                    cardContent={availableNowIntegrationsContent?.find(content => content.integrationCode === IntegrationCodeType[integration.code])}
                                                    isCurrent={false}
                                                    isAvailable={false}
                                                    isUpgradeRequired={true}
                                                    isComingSoon={false}
                                                />
                                            </Grid>
                                        )
                                    )}
                                </Grid>
                            </Grid>
                        )}
                        {comingSoonIntegrationsContent?.length !== 0 && (
                            <Grid item sx={style.section}>
                                <Typography align="left" sx={style.sectionTitle}>
                                    {t('comingSoonSectionTitle')}
                                </Typography>
                                <Grid container sx={style.cardsContainer}>
                                    {comingSoonIntegrationsContent?.map(
                                        (content: IntegrationCardContent) => (
                                            <Grid item key={content.displayName}>
                                                <IntegrationCard
                                                    cardContent={content}
                                                    isCurrent={false}
                                                    isAvailable={false}
                                                    isUpgradeRequired={false}
                                                    isComingSoon={true}
                                                />
                                            </Grid>
                                        )
                                    )}
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>
        </Main>
    );
}

export default function Page() {
    return (
        <ProtectedRoute>
            <Integrations/>
        </ProtectedRoute>
    );
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['integrations', 'components']))
        }
    };
}
