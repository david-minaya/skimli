import { Box, Button, Container, IconButton, Tooltip } from '@mui/material';
import { Main } from '~/components/main/main.component';
import { BadgeCheckIcon } from '~/icons/badgeCheckIcon';
import { CurrencyDollarIcon } from '~/icons/currencyDollarIcon';
import { InfoIcon } from '~/icons/infoIcon';
import { InvoiceIcon } from '~/icons/invoiceIcon';
import { LightningBoldIcon } from '~/icons/lightningBoltIcon';
import { ProtectedRoute } from '../../protected-route/protected-route.component';
import { style } from './index.style';

function Plan() {
  return (
    <Main>
      <Box sx={style.container}>
        <Box sx={style.title}>Billing</Box>
        <Container sx={style.content} maxWidth='md'>
          <Box sx={style.sectionTitle}>
            <BadgeCheckIcon sx={style.sectionTitleIcon}/>
            <Box>Plan</Box>
          </Box>
          <Box sx={style.sectionSubTitle}>View and change your plan</Box>
          <Box sx={style.cards}>
            <Box sx={style.card}>
              <Box sx={style.cardTitle}>Your plan</Box>
              <Box sx={style.cardSubTitle}>Skimli Free</Box>
              <Box sx={style.cardDescription}>Upload, edit and share Skim Videos. Limit of 10 videos in your library</Box>
              <Box sx={style.cardInfo}>
                <Tooltip
                  componentsProps={{ tooltip: { sx: style.tooltip } }}
                  title='You have a maximum of 10 conversions with your current plan. Upgrade to Skimli Pro to get unlimited conversions.'>
                  <IconButton sx={style.cardInfoIconButton}>
                    <InfoIcon sx={style.cardInfoIcon}/>
                  </IconButton>
                </Tooltip>
                0/10 Convercions
              </Box>
            </Box>
            <Box sx={style.card}>
              <Box sx={style.cardTitle}>Upgrade your plan to</Box>
              <Box sx={style.cardSubTitle}>Skimli Pro</Box>
              <Box sx={style.cardDescription}>
                Customize your viewers experience with your logo, brand and watermark. Unlimited videos in your library.
              </Box>
              <Button
                sx={style.button}>
                <LightningBoldIcon sx={style.buttonIcon}/>
                Upgrade
              </Button>
            </Box>
          </Box>
          <Box sx={style.sectionTitle}>
            <CurrencyDollarIcon sx={style.sectionTitleIcon}/>
            <Box>Payment details</Box>
          </Box>
          <Box sx={style.sectionSubTitle}>You don’t have any payment details yet</Box>
          <Box sx={style.sectionTitle}>
            <InvoiceIcon sx={style.sectionTitleIcon}/>
            <Box>Invoices</Box>
          </Box>
          <Box sx={style.sectionSubTitle}>You don’t have any invoices yet</Box>
        </Container>
      </Box>
    </Main>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <Plan/>
    </ProtectedRoute>
  );
}
