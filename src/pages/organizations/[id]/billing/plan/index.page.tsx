import { Box, Container } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { ConversionsCounter } from '~/components/conversions-counter/conversions-counter.component';
import { Main } from '~/components/main/main.component';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { BadgeCheckIcon } from '~/icons/badgeCheckIcon';
import { CurrencyDollarIcon } from '~/icons/currencyDollarIcon';
import { InvoiceIcon } from '~/icons/invoiceIcon';
import { LightningBoldIcon } from '~/icons/lightningBoltIcon';
import { ProtectedRoute } from '../../protected-route/protected-route.component';
import { style } from './index.style';

function Plan() {

  const { t } = useTranslation('billing');

  return (
    <Main>
      <Box sx={style.container}>
        <Box sx={style.title}>{t('title')}</Box>
        <Container sx={style.content} maxWidth='md'>
          <Box sx={style.sectionTitle}>
            <BadgeCheckIcon sx={style.sectionTitleIcon}/>
            <Box>{t('planTitle')}</Box>
          </Box>
          <Box sx={style.sectionSubTitle}>{t('planSubtitle')}</Box>
          <Box sx={style.cards}>
            <Box sx={style.card}>
              <Box sx={style.cardTitle}>{t('freePlanCardTitle')}</Box>
              <Box sx={style.cardSubTitle}>{t('freePlanCardSubtitle')}</Box>
              <Box sx={style.cardDescription}>{t('freePlanCardDescription')}</Box>
              <ConversionsCounter sx={style.convertionsCounter}/>
            </Box>
            <Box sx={style.card}>
              <Box sx={style.cardTitle}>{t('proPlanCardTitle')}</Box>
              <Box sx={style.cardSubTitle}>{t('proPlanCardSubtitle')}</Box>
              <Box sx={style.cardDescription}>{t('proPlanCardDescription')}</Box>
              <OutlinedButton
                sx={style.button}
                title={t('proPlanCardButton')}
                icon={LightningBoldIcon}/>
            </Box>
          </Box>
          <Box sx={style.sectionTitle}>
            <CurrencyDollarIcon sx={style.sectionTitleIcon}/>
            <Box>{t('paymentTitle')}</Box>
          </Box>
          <Box sx={style.sectionSubTitle}>{t('paymentSubtitle')}</Box>
          <Box sx={style.sectionTitle}>
            <InvoiceIcon sx={style.sectionTitleIcon}/>
            <Box>{t('invoiceTitle')}</Box>
          </Box>
          <Box sx={style.sectionSubTitle}>{t('InvoiceSubtitle')}</Box>
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

export async function getServerSideProps({ locale }) {
  return {
    props: { 
      ...(await serverSideTranslations(locale, ['billing', 'components']))
    }
  };
}
