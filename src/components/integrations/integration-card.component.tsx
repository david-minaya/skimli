/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {
  IntegrationCategoryType,
  UserIntegration,
  AyrshareJwt,
} from '~/graphqls/schema/integrations.type';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { style } from './integration-card.style';
import { IntegrationCardContent } from '~/graphqls/contentful/types/integrationCardContent';
import { useTranslation } from 'next-i18next';
import { Toast } from '~/components/toast/toast.component';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useAddSocialAccount } from '~/graphqls/useAddSocialAccount';

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

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openFailToast, setOpenFailToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const addSocialAccount = useAddSocialAccount();

  const handleClickAdd = async () => {
    try {
      // Disable interactions with the button
      setIsButtonDisabled(true);
      setLoading(true);

      if (integration?.category == IntegrationCategoryType.SOCIAL_MEDIA) {
        const response = await addSocialAccount(integration?.code);
        const redirectUri = window.location.href;
        const urlWithRedirect = `${response.addSocialAccount.url}&redirect=${redirectUri}`;
        window.location.href = urlWithRedirect;
      } else {
        //TODO: remove temp sleep statement
        await sleep(1000);
      }

      // Enable interactions with the button
      setLoading(false);
      setIsButtonDisabled(false);

      // Show the success toast
      setOpenSuccessToast(true);
    } catch (err: any) {
      setOpenFailToast(true);
    }
  };
  function getAddButtonLabelByCategory(category?: IntegrationCategoryType) {
    switch (category) {
      case IntegrationCategoryType.CLOUD_DRIVE:
        return t('addButton.cloudDrive');
      case IntegrationCategoryType.CLOUD_STORAGE:
        return t('addButton.cloudStorage');
      case IntegrationCategoryType.CMS:
        return t('addButton.cms');
      case IntegrationCategoryType.DAM:
        return t('addButton.dam');
      case IntegrationCategoryType.SOCIAL_MEDIA:
        return t('addButton.socialMedia');
      case IntegrationCategoryType.VIDEO_SERVICE:
        return t('addButton.videoService');
      default:
        return t('addButton.default');
    }
  }

  //TODO: remove temporary sleep function
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <Paper variant='outlined' sx={style.card}>
      <Grid container sx={style.cardLayout}>
        <Grid item sx={style.cardHeader}>
          <Avatar alt={cardContent?.logo.title} src={cardContent?.logo.url}/>
          <Typography sx={style.displayName}>
            {cardContent?.displayName}
          </Typography>
          <Chip
            sx={style.category}
            size='small'
            label={cardContent?.category}
          />
        </Grid>
        <Grid item sx={style.description}>
          <Typography sx={style.descriptionText}>
            {cardContent?.description}
          </Typography>
        </Grid>
        <Grid item sx={style.actionsSection}>
          {isCurrent && (
            <Box>
              <Box sx={style.accountSection}>
                <Avatar
                  alt={integration?.displayName}
                  src={integration?.userImage}
                  sx={style.accountAvatar}
                  variant='square'
                />
                <Typography sx={style.accountName}>
                  {integration?.displayName}
                </Typography>
                <LoadingButton
                  sx={style.manageButton}
                  onClick={handleClickAdd}
                  disabled={isButtonDisabled}
                  loading={loading}
                >
                  <span>{t('manageButton')}</span>
                </LoadingButton>
              </Box>
            </Box>
          )}
          {isAvailable && (
            <LoadingButton
              sx={style.button}
              onClick={handleClickAdd}
              disabled={isButtonDisabled}
              loading={loading}
            >
              <span>{getAddButtonLabelByCategory(integration?.category)}</span>
            </LoadingButton>
          )}
          {isUpgradeRequired && (
            <Button sx={style.button}>{t('upgradeButton')}</Button>
          )}
          {isComingSoon && (
            <Chip
              sx={style.comingSoon}
              variant='outlined'
              size='small'
              label={t('comingSoonChip')}
            />
          )}
        </Grid>
      </Grid>
      <Toast
        open={openSuccessToast}
        severity='success'
        onClose={() => setOpenSuccessToast(false)}
        description={t('toastAlerts.success', {
          account: cardContent?.displayName,
        })}
      />
      <Toast
        open={openFailToast}
        severity='error'
        onClose={() => setOpenFailToast(false)}
        description={t('toastAlerts.fail', {
          account: cardContent?.displayName,
        })}
      />
    </Paper>
  );
}
