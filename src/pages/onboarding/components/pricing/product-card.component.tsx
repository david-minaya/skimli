/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import { Product } from '~/graphqls/contentful/types/product';
import { PlanDetails } from './plan-details.component';
import { useState } from 'react';
import {
  Button,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Plan } from '~/graphqls/contentful/types/plan';
import { EastRounded } from '@mui/icons-material';
import { ISubscribeToPlanArgs } from '../../../../graphqls/useSubscribeToPlan';

interface Props {
  product: Product;
  disabled: boolean;
  onClick: (args: ISubscribeToPlanArgs) => Promise<void>;
}

export function ProductCard(props: Props) {
  const { product, disabled, onClick } = props;
  const [plan, setPlan] = useState<Plan | null | undefined>(
    product?.plansCollection?.items?.[0]
  );

  function handleChange(e: SelectChangeEvent<string>) {
    const selectedPlanCode = e.target.value;
    const selectedPlan = product?.plansCollection?.items?.find(
      (plan) => plan.code === selectedPlanCode
    );
    setPlan(selectedPlan);
  }

  function handleClick() {
    if (plan) {
      onClick({
        planCode: plan.code,
        productCode: product.code,
        isPaid: product.creditCardRequired,
        provider: 'STRIPE',
      });
    }
  }

  return (
    <Paper
      variant='outlined'
      sx={{
        borderTop: '10px solid #FC4603',
        borderLeft: '1px solid #FC4603',
        borderRight: '1px solid #FC4603',
        borderBottom: '1px solid #FC4603',
      }}
    >
      <Typography variant='h6' align='center' mt={1}>
        {product?.name}
      </Typography>
      <Typography
        variant='body2'
        align='center'
        my={0}
        sx={{
          px: { xs: 0, sm: 0, lg: 6 },
        }}
      >
        {product?.description}
      </Typography>
      <Divider variant='middle' sx={{ border: '1px solid #FC4603', mt: 0.5 }}/>
      <Grid
        container
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        {plan && <PlanDetails plan={plan}/>}
        {product?.plansCollection?.items?.length > 1 && (
          <Grid item mt={1}>
            <Select
              value={plan?.code}
              onChange={handleChange}
              variant='standard'
            >
              {product?.plansCollection?.items?.map((plan) => (
                <MenuItem key={plan?.code} value={plan?.code}>
                  {plan?.credits} Credits
                </MenuItem>
              ))}
            </Select>
          </Grid>
        )}
        <Grid item my={2}>
          <Button
            disabled={disabled || !plan}
            onClick={handleClick}
            sx={{
              width: '100%',
              backgroundColor: 'primary.main',
              borderColor: 'primary.main',
              fontSize: '17px',
              fontWeight: 600,
              color: 'white',
              ':hover': {
                backgroundColor: 'primary.dark',
                borderColor: 'primary.dark',
              },
            }}
          >
            {product?.buttonCta}
            <EastRounded/>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
