'use client';

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'src/utils/axios';
import { CHANGE_PASSWORD } from 'src/utils/apiendpoints';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuthContext();
  const token = user?.accessToken;
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset the error state
    setConfirmPasswordError(false);

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }

    // Create the data object to be sent in the request
    const data = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      setLoading(true);
      // Make the POST request to change password API
      await axios.post(CHANGE_PASSWORD, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If successful, log the user out
      enqueueSnackbar('Password changed successfully', { variant: 'success' });
      logout();
      router.push('/auth/jwt/login');
    } catch (error) {
      console.error('Error changing password:', error);
      enqueueSnackbar(error.message || 'Unknown error', { variant: 'error' });
      // Handle errors (you can also display an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Current Password"
          type={showCurrentPassword ? 'text' : 'password'}
          variant="outlined"
          margin="normal"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowCurrentPassword((prev) => !prev)} edge="end">
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          variant="outlined"
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNewPassword((prev) => !prev)} edge="end">
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={confirmPasswordError}
          helperText={confirmPasswordError ? 'Passwords do not match' : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          disabled={loading}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
