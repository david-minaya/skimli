import { useState, useEffect, Fragment } from 'react';
import { Alert, Box, InputBase, Link, Snackbar } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useUpdateName } from '~/graphqls/useUpdateName';
import { useResetPassword } from '~/graphqls/useResetPassword';
import { style } from './profile-tab.style';

export function ProfileTab() {

  const { user } = useUser();
  const [name, setName] = useState('');
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openFailToast, setOpenFailToast] = useState(false);
  const [showResetPasswordMessage, setShowResetPasswordMessage] = useState(false);
  
  const updateName = useUpdateName();
  const resetPassword = useResetPassword();

  useEffect(() => {
    setName(user?.nickname || '');
  }, [user])

  async function handleUpdateName() {

    try {

      await updateName(name!);
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
        <Box sx={style.inputTitle}>Name</Box>
        <InputBase
          sx={[style.input, style.nameInput as any]} 
          value={name}
          onChange={event => setName(event.target.value)}
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
      <Snackbar 
        open={openSuccessToast} 
        autoHideDuration={6000} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setOpenSuccessToast(false)}>
        <Alert 
          sx={style.alert}
          severity='success' 
          onClose={() => setOpenSuccessToast(false)}>
          Name updated successfully
        </Alert>
      </Snackbar>
      <Snackbar 
        open={openFailToast} 
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setOpenFailToast(false)}>
        <Alert 
          sx={style.alert}
          severity='error'
          onClose={() => setOpenFailToast(false)}>
          Fail update name
        </Alert>
      </Snackbar>
    </Box>
  );
}
