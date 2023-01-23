import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Step } from './components/step/step.component';
import { style } from './index.style';
import { ProfileStep } from './profile-step/profile-step.component';
import { PricingStep } from './pricing-step/pricing-step.component';
import { LibraryStep } from './library-step/library-step.component';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useCheckUserExists } from '~/graphqls/useCheckUserExists';
import { useRouter } from 'next/router';

export default function Onboarding() {

  const router = useRouter();
  const { user } = useUser();
  const [index, setIndex] = useState(3);
  const [loading, setLoading] = useState(true);

  const checkUserExists = useCheckUserExists();

  useEffect(() => {

    (async () => {

      try {

        const user = await checkUserExists();
  
        if (user && !user.subscriptionId) {
          setIndex(2);
          setLoading(false);
          return;
        }
  
        if (user) {
          router.push('/');
        }

      } catch (err: any) {

        setLoading(false);
      }

    })();
  }, [checkUserExists, router]);

  if (!user || loading) return null;

  return (
    <Box sx={style.container}>
      <Box sx={style.steps}>
        <Step
          value={1}
          index={index}
          warning={user.email_verified !== null && !user.email_verified}
          title='Profile details'/>
        <Step
          value={2}
          index={index}
          title='Choose a plan'/>
        <Step
          value={3}
          index={index}
          title='Get started'/>
      </Box>
      <Box sx={style.content}>
        <ProfileStep 
          show={index === 1} 
          onNext={() => setIndex(2)}/>
        <PricingStep 
          show={index === 2} 
          onNext={() => setIndex(3)}/>
        <LibraryStep 
          show={index === 3}/>
      </Box>
    </Box>
  );
}
