import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import share from './../../assets/images/img/share.png';
import CloseIcon from '@mui/icons-material/Close';

function Booking() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const [userId, setUserId] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const userIdFromSessionStorage = localStorage.getItem('userId');
    if (userIdFromSessionStorage) {
      setUserId(userIdFromSessionStorage);
      console.log(userIdFromSessionStorage);
    }
  }, []);
  const link = `http://localhost:8080/booking/${userId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);

      setIsCopied(true);

      setTimeout(() => {
        setOpen(false);
        setIsCopied(false);
      }, 500);
      console.log('Link Copied');
    } catch (error) {
      console.log('Error copying', error);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton
          onClick={() => {
            setOpen(false);
            setIsCopied(false);
          }}
          sx={{ position: 'absolute', right: 0, top: 0 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle id="alert-dialog-title">Direct Link for bookings</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography fontSize={12} mb={3} color="GrayText">
              {' '}
              Just with one click the customers can reach your business profiles and book
              appointments.
            </Typography>
          </DialogContentText>
          <Box
            sx={{
              mt: '10px',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                border: '1px dotted blue',
                backgroundColor: '#E8F0FE',
                width: '100%',
                fontSize: '12px',
                py: '5px',
                paddingX: '10px',
                gap: '4px',
                mr: '10px',
              }}
            >
              {link}
            </Typography>{' '}
            {isCopied ? (
              <Button variant="contained" size="small">
                Copied
              </Button>
            ) : (
              <Button size="small" onClick={copyToClipboard} variant="contained" color="primary">
                Copy
              </Button>
            )}
          </Box>
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>

      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1,
              p: '30px',
            }}
          >
            <Typography variant="h3">Allow Your Clients Book Appointments Online!</Typography>
            <Typography>
              Invite clients to register for events and activities from your website, promotional
              emails, social campaigns using our booking integrations
            </Typography>
            <Typography variant="subtitle2" fontSize={13} color="gray">
              Simply insert a link to your website or social media and that's it.
            </Typography>

            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{ width: '140px', mt: '40px' }}
            >
              Generate Link
            </Button>
          </Box>
          <Box sx={{ flex: 1 }}>
            <img src={share} style={{ width: '80%', height: '400px' }} alt="" />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Booking;
