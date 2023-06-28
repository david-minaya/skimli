import { useEffect } from 'react';

export function PricingStep() {
  useEffect(() => {
    console.log('hello');
  }, []);
}

// export function PricingStep(props: Props) {

//   const {
//     show,
//     onNext
//   } = props;

//   const { t } = useTranslation('onboarding');
//   const subscriptionPlanSection = useSubscriptionPlans();
//   const subscribeToPlan = useSubscribeToPlan();
//   const [openFailToast, setOpenFailToast] = useState(false);
//   const [disabled, setDisabled] = useState(false);

//   async function handleClick() {

//     try {

//       setDisabled(true);
//       await subscribeToPlan('FreePlan');
//       onNext();

//     } catch (err: any) {

//       setOpenFailToast(true);
//       setDisabled(false);
//     }
//   }

//   if (!show || !subscriptionPlanSection) return null;

//   return (
//     <Box sx={style.container}>
//       <Box sx={style.content}>
//         <Box sx={style.title}>{t('pricing.title')}</Box>
//         <Box sx={style.plans}>
//           {subscriptionPlanSection.subscriptionPlans?.map(plan =>
//             <PlanCard
//               key={plan.productCode}
//               plan={plan}
//               disabled={disabled}
//               onClick={handleClick}/>
//           )}
//         </Box>
//         <Link
//           sx={style.link}
//           href={`${process.env.NEXT_PUBLIC_WEB_SITE_DOMAIN}/pricing`}>
//           <Box>{t('pricing.link')}</Box>
//           <OpenInNewRounded sx={style.linkIcon}/>
//         </Link>
//       </Box>
//       <Toast
//         open={openFailToast}
//         severity='error'
//         description={t('pricing.errorToast')}
//         onClose={() => setOpenFailToast(false)}/>
//     </Box>
//   );
// }
