/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { usePricingPage } from '~/graphqls/contentful/usePricingPage';
import { useEffect, useState } from 'react';
import {
  ISubscribeToPlanArgs,
  useSubscribeToPlan,
} from '~/graphqls/useSubscribeToPlan';
import { Toast } from '~/components/toast/toast.component';
import { Box, Grid, Link, Typography } from '@mui/material';
import { OpenInNewRounded } from '@mui/icons-material';
import { ProductCard } from '../components/pricing/product-card.component';
import Image from 'next/image';
import { useCreateStripeSession } from '../../../graphqls/useCreateStripeSession';
import { Loading } from '../../../components/loading/loading.component';
import { useAccount } from '../../../store/account.slice';

interface Props {
  show: boolean;
  onNext: () => void;
}

const _planDetailsKey = '_planDetails';

export function PlanStep(props: Props) {
  const { show, onNext } = props;
  const pricingPage = usePricingPage();
  const subscribeToPlan = useSubscribeToPlan();
  const createStripeSession = useCreateStripeSession();
  const [openFailToast, setOpenFailToast] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const accountStore = useAccount();
  const account = accountStore.get();

  async function handleCheckoutSuccess({ sessionId }: { sessionId?: string }) {
    const args = JSON.parse(localStorage.getItem(_planDetailsKey) ?? '{}');
    if (!args) {
      console.warn('plan details args not set');
      return;
    }
    const _account = await subscribeToPlan({ ...args, sessionId: sessionId });
    accountStore.set({...account, ..._account});
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    try {
      const success = query.get('success');
      if (success) {
        setLoading(true);
        handleCheckoutSuccess({ sessionId: success }).then(() => {
          onNext();
          setLoading(false);
        });
      } else if (query.get('canceled')) {
        localStorage.removeItem(_planDetailsKey);
      }
    } catch (e) {
      setOpenFailToast(true);
      setDisabled(false);
    }
  }, []);

  async function handleClick(args: ISubscribeToPlanArgs) {
    try {
      setDisabled(true);

      if (args.isPaid) {
        const url = await createStripeSession();
        localStorage.setItem(_planDetailsKey, JSON.stringify(args));
        location.href = url;
      } else {
        setLoading(true);
        await subscribeToPlan(args);
        setLoading(false);
        onNext();
      }
    } catch (err: any) {
      setOpenFailToast(true);
      setDisabled(false);
    }
  }

  if (!show || !pricingPage) return null;
  if (loading) return <Loading/>;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        mt={1}
      >
        <Grid item>
          <Typography align='center' variant='h4'>
            {pricingPage?.headline}
          </Typography>
          <Typography align='center' variant='h6' mt={1}>
            {pricingPage?.description}
          </Typography>
        </Grid>
        <Grid
          container
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='start'
          mt={2}
        >
          {pricingPage?.products?.map((product) => (
            <Grid item key={product.code} lg={4} px={6}>
              <ProductCard
                product={product}
                disabled={disabled}
                onClick={handleClick}
              />
            </Grid>
          ))}
        </Grid>
        {/*<Grid item mt={1}>
                    <ProductList products={pricingPage?.products}/>
                </Grid>*/}
        <Grid item mt={1}>
          <Link
            href={`${process.env.NEXT_PUBLIC_WEB_SITE_DOMAIN}/pricing`}
            target='_blank'
            sx={{
              display: 'flex',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box>See Pricing FAQ for more details</Box>
            <OpenInNewRounded
              sx={{
                width: '17px',
                height: '17px',
                marginLeft: '8px',
              }}
            />
          </Link>
        </Grid>
        <Grid item mt={1}>
          <Image
            src='/images/stripe.png'
            alt='Powered by Stripe'
            width='177'
            height='40'
          />
        </Grid>
      </Grid>
      <Toast
        open={openFailToast}
        severity='error'
        description='Subscribe to plan failed'
        onClose={() => setOpenFailToast(false)}
      />
    </Box>
  );
}
