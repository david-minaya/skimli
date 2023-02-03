import { useState, useEffect, ChangeEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { TaskAltRounded, ErrorOutlineRounded } from '@mui/icons-material';
import { useUpdateName } from '~/graphqls/useUpdateName';
import { useCreateUser } from '~/graphqls/useCreateUser';
import { useResentVerificationEmail } from '~/graphqls/useResentVerificationEmail';
import { TextField } from '~/components/text-field/text-field.component';
import { Timeout } from '~/components/timeout/timeout.component';
import { Toast } from '~/components/toast/toast.component';
import { style } from './profile-step.style';

interface Props {
  show: boolean;
  onNext: () => void;
}

export function ProfileStep(props: Props) {

  const {
    show,
    onNext
  } = props;

  const { t } = useTranslation('onboarding');
  const { user, checkSession } = useUser();
  const [name, setName] = useState('');
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openFailToast, setOpenFailToast] = useState(false);
  const [openServerErrorToast, setOpenServerErrorToast] = useState(false);
  const [isEmailSended, setIsEmailSended] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const updateName = useUpdateName();
  const resentVerificationEmail = useResentVerificationEmail();
  const createUser = useCreateUser();

  useEffect(() => {
    setName(user?.nickname || '');
  }, [user]);

  async function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length <= 64) {
      setName(event.target.value)
    }
  }

  async function handleUpdateName() {

    if (!name || name.trim() === '') return;

    try {

      await updateName(name);
      await checkSession();
      setOpenSuccessToast(true);

    } catch (err) {

      setOpenFailToast(true);
      setName(user?.nickname || '');
    }
  }

  async function handleSendVerificationEmail() {

    try {

      setIsEmailSended(true);
      await resentVerificationEmail();

    } catch (err: any) {

      console.log('error: ', err);
    }
  }

  async function handleNext() {

    try {

      setDisabled(true);
      await createUser();
      onNext();

    } catch (err: any) {

      setOpenServerErrorToast(true);
      setDisabled(false);
    }
  }

  if (!show || !user) return null;

  return (
    <Box sx={style.container}>
      <Box sx={style.content}>
        <Box sx={style.title}>{t('profile.title')}</Box>
        <TextField
          sx={style.textField as any}
          title={t('profile.nameTextField')}
          value={name}
          onChange={handleNameChange}
          onBlur={handleUpdateName}/>
        <TextField
          sx={{
            ...style.textField as any,
            ...(!user.email_verified ? style.emailNotVerified : {})
          }}
          title={t('profile.emailTextField')}
          value={user.email || ''}
          disabled={true}/>
        {user.email_verified &&
          <Box sx={style.message}>
            <TaskAltRounded sx={style.verifiedIcon}/>
            <Box>{t('profile.verifiedEmail')}</Box>
          </Box>
        }
        {!user.email_verified &&
          <Box sx={style.message}>
            <ErrorOutlineRounded sx={style.errorIcon}/>
            <Box>{t('profile.notVerifiedEmail')}</Box>
          </Box>
        }
        {user.email_verified &&
          <Button
            sx={style.button} 
            variant='contained'
            disabled={disabled}
            onClick={handleNext}>
            {t('profile.nextButton')}
          </Button>
        }
        {!user.email_verified &&
          <Button
            sx={style.button} 
            variant='contained'
            disabled={isEmailSended}
            onClick={handleSendVerificationEmail}>
            {t('profile.verificationButton')}
          </Button>
        }
        <Timeout
          show={isEmailSended}
          timeout={60000}
          onTimeout={() => setIsEmailSended(false)}/>
      </Box>
      <Toast
        open={openSuccessToast}
        severity='success'
        title={t('profile.successToast')}
        onClose={() => setOpenSuccessToast(false)}/>
      <Toast
        open={openFailToast}
        severity='error'
        title={t('profile.errorToast')}
        onClose={() => setOpenFailToast(false)}/>
      <Toast
        open={openServerErrorToast}
        severity='error'
        title={t('profile.serverErrorToast')}
        onClose={() => setOpenServerErrorToast(false)}/>
    </Box>
  );
}
