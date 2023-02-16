import { useState } from 'react';
import { Box, Link } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Toast } from '~/components/toast/toast.component';
import { SubscriptionPlan } from '~/graphqls/contentful/types/subscriptionPlan';
import { useSubscriptionPlans } from '~/graphqls/contentful/useSubscriptionPlans';
import { useSubscribeToPlan } from '~/graphqls/useSubscribeToPlan';
import { PlanCard } from '../components/plan-card/plan-card.component';
import { style } from './pricing-step.style';
import { OpenInNewRounded } from '@mui/icons-material';

interface Props {
  show: boolean;
  onNext: () => void;
}

export function PricingStep(props: Props) {

  const {
    show,
    onNext
  } = props;

  const { t } = useTranslation('onboarding');
  const subscriptionPlanSection = useSubscriptionPlans();
  const subscribeToPlan = useSubscribeToPlan();
  const [openFailToast, setOpenFailToast] = useState(false);
  const [disabled, setDisabled] = useState(false);

  async function handleClick(plan: SubscriptionPlan) {

    try {

      setDisabled(true);
      await subscribeToPlan('FreePlan');
      onNext();

    } catch (err: any) {

      setOpenFailToast(true);
      setDisabled(false);
    }
  }

  if (!show || !subscriptionPlanSection) return null;

  return (
    <Box sx={style.container}>
      <Box sx={style.content}>
        <Box sx={style.title}>{t('pricing.title')}</Box>
        <Box sx={style.plans}>
        {subscriptionPlanSection.subscriptionPlans?.map(plan => 
          <PlanCard 
            key={plan.productCode} 
            plan={plan}
            disabled={disabled}
            onClick={handleClick}/>
        )}
        </Box>
        <Link
          sx={style.link}
          href={`${process.env.NEXT_PUBLIC_WEB_SITE_DOMAIN}/pricing`}>
          <Box>{t('pricing.link')}</Box>
          <OpenInNewRounded sx={style.linkIcon}/>
        </Link>
      </Box>
      <Toast
        open={openFailToast}
        severity='error'
        description={t('pricing.errorToast')}
        onClose={() => setOpenFailToast(false)}/>
    </Box>
  );
}
