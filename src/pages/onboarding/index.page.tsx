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
import { Loading } from '~/components/loading/loading.component';

export default function Onboarding() {

  const router = useRouter();
  const { user, isLoading } = useUser();
  const [index, setIndex] = useState(1);
  const [loading, setLoading] = useState(true);

  const checkUserExists = useCheckUserExists();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  useEffect(() => {

    (async () => {

      try {

        const account = await checkUserExists();
  
        if (account && !account.subscriptionId) {
          setIndex(2);
          setLoading(false);
          return;
        }
  
        if (account) {
          router.push('/');
          return;
        }

        setLoading(false);

      } catch (err: any) {

        setLoading(false);
      }

    })();
  }, [checkUserExists, router]);

  if (!user || loading) return <Loading/>;

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
