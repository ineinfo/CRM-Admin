'use client';

import React, { useState } from 'react';
import {
  Card,
  Grid,
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useAuthContext } from 'src/auth/hooks';

const defaultAvatar = '/path-to-dummy-avatar.png'; // Dummy image path

function Profile({ metadata }) {
  const { user } = useAuthContext();
  console.log('dataaa', user);

  // Default values for user properties
  const {
    first_name = 'N/A',
    last_name = 'N/A',
    mobile_number = 'N/A',
    avatarurl = defaultAvatar,
    email = 'N/A',
    role_id = 0,
    created = new Date(),
  } = user || {}; // Default to empty object if user is null or undefined

  const [open, setOpen] = useState(false); // State to control dialog visibility
  const formattedDate = dayjs(created).format('DD-MM-YYYY');
  const role = role_id === 1 ? 'Administrator' : role_id === 2 ? 'Agent' : 'Unknown Role';

  const router = useRouter();

  const handleEdit = () => {
    router.push(`edit`); // Adjusted path
  };

  const handleDeleteClick = () => {
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const handleConfirmDelete = () => {
    console.log('It is deleted'); // Simulate delete action
    setOpen(false); // Close the dialog
  };

  return (
    <Box width={'90%'} margin={'auto'}>
      {/* Title and Buttons Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{metadata.title}</Typography>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteClick}>
            Delete
          </Button>
        </Box>
      </Box>

      {/* Grid for Profile Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 8, pb: 4, px: 3 }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Avatar
                src={avatarurl}
                alt={`${first_name} ${last_name}`}
                sx={{ width: 100, height: 100, margin: 'auto' }}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Typography variant="body1">
                <strong>First Name:</strong> {first_name}
              </Typography>
              <Typography variant="body1">
                <strong>Last Name:</strong> {last_name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {email}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> {role}
              </Typography>
              <Typography variant="body1">
                <strong>Mobile Number:</strong> {mobile_number}
              </Typography>
              <Typography variant="body1">
                <strong>Created At:</strong> {formattedDate}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure you want to delete?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Please confirm if you wish to delete the user.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;
