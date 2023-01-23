import { useState, useEffect, ChangeEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Button } from '@mui/material';
import { TaskAltRounded, ErrorOutlineRounded } from '@mui/icons-material';
import { useUpdateName } from '~/graphqls/useUpdateName';
import { useResentVerificationEmail } from '~/graphqls/useResentVerificationEmail';
import { TextField } from '~/components/text-field/text-field.component';
import { Timeout } from '~/components/timeout/timeout.component';
import { Toast } from '~/components/toast/toast.component';
import { style } from './profile-step.style';
import { useCreateUser } from '~/graphqls/useCreateUser';

interface Props {
  show: boolean;
  onNext: () => void;
}

export function ProfileStep(props: Props) {

  const {
    show,
    onNext
  } = props;

  const { user, checkSession } = useUser();
  const [name, setName] = useState('');
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openFailToast, setOpenFailToast] = useState(false);
  const [openServerErrorToast, setOpenServerErrorToast] = useState(false);
  const [isEmailSended, setIsEmailSended] = useState(false);

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
    setIsEmailSended(true);
    await resentVerificationEmail();
  }

  async function handleNext() {

    try {

      await createUser();
      onNext();

    } catch (err: any) {

      setOpenServerErrorToast(true);
    }
  }

  if (!show || !user) return null;

  return (
    <Box sx={style.container}>
      <Box sx={style.content}>
        <Box sx={style.title}>Your profile details</Box>
        <TextField
          sx={style.textField as any}
          title='Name'
          value={name}
          onChange={handleNameChange}
          onBlur={handleUpdateName}/>
        <TextField
          sx={{
            ...style.textField as any,
            ...(!user.email_verified ? style.emailNotVerified : {})
          }}
          title='Email'
          value={user.email || ''}
          disabled={true}/>
        {user.email_verified &&
          <Box sx={style.message}>
            <TaskAltRounded sx={style.verifiedIcon}/>
            <Box>Email verified</Box>
          </Box>
        }
        {!user.email_verified &&
          <Box sx={style.message}>
            <ErrorOutlineRounded sx={style.errorIcon}/>
            <Box>Check your inbox for verification instructions and refresh this page after completed.</Box>
          </Box>
        }
        {user.email_verified &&
          <Button
            sx={style.button} 
            variant='contained'
            onClick={handleNext}>
            Next
          </Button>
        }
        {!user.email_verified &&
          <Button
            sx={style.button} 
            variant='contained'
            disabled={isEmailSended}
            onClick={handleSendVerificationEmail}>
            Resend Verification Email
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
        title='Name updated successfully'
        onClose={() => setOpenSuccessToast(false)}/>
      <Toast
        open={openFailToast}
        severity='error'
        title='Fail update name'
        onClose={() => setOpenFailToast(false)}/>
      <Toast
        open={openServerErrorToast}
        severity='error'
        title='Upps an error happened'
        onClose={() => setOpenServerErrorToast(false)}/>
    </Box>
  );
}
