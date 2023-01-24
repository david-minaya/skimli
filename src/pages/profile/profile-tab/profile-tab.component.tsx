import { useState, useEffect, Fragment, ChangeEvent } from 'react';
import { Box, InputBase, Link } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useUpdateName } from '~/graphqls/useUpdateName';
import { useResetPassword } from '~/graphqls/useResetPassword';
import { style } from './profile-tab.style';
import { Toast } from '~/components/toast/toast.component';

export function ProfileTab() {

  const { user, checkSession } = useUser();
  const [name, setName] = useState('');
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openFailToast, setOpenFailToast] = useState(false);
  const [showResetPasswordMessage, setShowResetPasswordMessage] = useState(false);
  
  const updateName = useUpdateName();
  const resetPassword = useResetPassword();

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

  async function handleResetPassword() {
    await resetPassword(user?.email!);
    setShowResetPasswordMessage(true);
  }

  return (
    <Box>
      <Box sx={style.title}>Profile</Box>
      <Box sx={style.info}>
        <Box 
          sx={style.image}
          component='img'
          src={user?.picture || ''}/>
        <Box sx={style.details}>
          <Box>{user?.email}</Box>
          <Box>Your Skimli profile picture is provided by Gravatar</Box>
          <Link 
            href='https://en.gravatar.com/' 
            sx={style.link}
            target="_blank">
            Change picture
          </Link>
        </Box>
      </Box>
      <Box sx={style.inputContainer}>
        <Box sx={style.inputTitle}>
          <Box>Name</Box>
          <Box>{name.length}/64</Box>
        </Box>
        <InputBase
          sx={style.input} 
          value={name}
          onChange={handleNameChange}
          onBlur={handleUpdateName}/>
      </Box>
      <Box sx={style.inputContainer}>
        <Box sx={style.inputTitle}>Current Email Address</Box>
        <InputBase
          sx={style.input}
          disabled
          value={user?.email || ''}/>
      </Box>
      {user?.sub?.startsWith('auth0') &&
        <Fragment>
          <Link
            sx={style.link}
            onClick={handleResetPassword}>
            Change Your Password
          </Link>
          {showResetPasswordMessage &&
            <Box sx={style.resetPasswordMessage}>
              Check your email for instructions on how to reset your password.
            </Box>
          }
        </Fragment>
      }
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
    </Box>
  );
}
