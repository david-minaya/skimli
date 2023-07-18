/*
 * Copyright (c) 2023. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * o not distribute outside Skimli LLC.
 */

import {Plan} from '~/graphqls/contentful/types/plan';
import {Grid, Typography} from '@mui/material';

interface Props {
    plan: Plan;
}

export function PlanDetails(props: Props) {
  const {plan} = props;
  return (
    <Grid item mt={1}>
      <Typography
        variant='h4'
        align='center'
      >
        {plan?.price}
      </Typography>
      <Typography
        variant='body2'
        align='center'
      >
        {plan?.interval}
      </Typography>
      <Grid
        container
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        mt={1}
      >
        <Grid
          item
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
        >
          <Typography
            variant='h6'
            align='center'
            color='primary.main'
          >
            {plan?.credits}
          </Typography>
          <Typography
            variant='h6'
            align='center'
            color='text.primary'
            pl={1}
          >
                        CREDITS
          </Typography>
        </Grid>
        <Grid
          item
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          mt={1}
        >
          <Grid
            container
            display='flex'
            flexDirection='row'
            justifyContent='center'
            alignItems='center'
          >
            <Grid
              item
            >
              <Typography
                variant='h5'
                align='center'
                color='primary.main'
              >
                {plan?.limits?.minutesVideo}
              </Typography>
              <Typography
                variant='body2'
                align='center'
                color='text.primary'
              >
                                MINS
              </Typography>
              <Typography
                variant='body2'
                align='center'
                color='text.primary'
              >
                                VIDEO
              </Typography>
            </Grid>
            <Grid
              item
              pl={4}
            >
              <Typography
                variant='h5'
                align='center'
                color='primary.main'
              >
                {plan?.limits?.minutesMetadata}
              </Typography>
              <Typography
                variant='body2'
                align='center'
                color='text.primary'
              >
                                MINS
              </Typography>
              <Typography
                variant='body2'
                align='center'
                color='text.primary'
              >
                                METADATA
              </Typography>
            </Grid>

          </Grid>

        </Grid>
        <Grid item
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          mt={1}
        >
          <Typography
            variant='h6'
            align='center'
            color='primary.main'
          >
            {plan?.limits?.libraryStorageGigabytes}GB
          </Typography>
          <Typography
            variant='h6'
            align='center'
            color='text.primary'
            pl={1}
          >
                        STORAGE
          </Typography>
        </Grid>
        <Grid item
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          mt={0}
        >
          <Typography
            variant='h6'
            align='center'
            color='primary.main'
          >
            {plan?.limits?.distributionBandwidthGigabytes}GB
          </Typography>
          <Typography
            variant='h6'
            align='center'
            color='text.primary'
            pl={1}
          >
                        BANDWIDTH
          </Typography>
        </Grid>

      </Grid>
    </Grid>
  );
}
