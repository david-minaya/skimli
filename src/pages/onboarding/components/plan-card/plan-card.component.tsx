import { Box, Button, Tooltip, Typography } from '@mui/material';
import { CheckRounded, EastRounded, HelpOutline } from '@mui/icons-material';
import { SubscriptionPlan } from '~/graphqls/contentful/types/subscriptionPlan';
import { style } from './plan-card.style';

interface Props {
  plan: SubscriptionPlan;
  onClick: (plan: SubscriptionPlan) => void;
}

export function PlanCard(props: Props) {

  const { 
    plan,
    onClick
  } = props;
  
  return (
    <Box 
      sx={[style.card, plan.mostPopular && style.cardHighlight as any]}>
      <Box 
        sx={[style.popular, plan.mostPopular && style.visible as any]}>
        Most Popular
      </Box>
      <Box sx={style.header}>
        <Typography
          sx={style.title} 
          variant='h6'>
          {plan.title}
        </Typography>
        <Box sx={style.priceContainer}>
          <Box sx={style.price} component='span'>{plan.displayPrice.split(' ')[0]}</Box>
          <Box sx={style.timeFrame} component='span'>{plan.displayPrice.split(' ')[1]}</Box>
        </Box>
        <Box sx={style.subTitle}>{plan.priceDescription}</Box>
        <Button
          sx={[style.button, plan.mostPopular && style.buttonHighlight as any]}
          onClick={() => onClick(plan)}>
          {plan.buttonName}
          <EastRounded sx={style.buttonIcon}/>
        </Button>
      </Box>
      <Box sx={style.body}>
        <Box sx={style.subTitle}>{plan.features.description}</Box>
        {plan.features.list.map((feature, index) => 
          <Box key={index} sx={style.features}>
            <Box sx={style.feature}>
              <CheckRounded sx={style.featureIcon}/>
              <Box component='span'>{feature.feature}</Box>
              {feature.toolTip &&
                <Tooltip placement='top-start' title={feature.toolTip}>
                  <HelpOutline sx={style.featureHelpIcon}/>
                </Tooltip>
              }
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
