import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  FormLabel,
  Fab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FeatherIcon from 'feather-icons-react';
import { Form } from 'react-router-dom';
import ImageUploader from 'react-image-upload';

import FileUploadIcon from '@mui/icons-material/FileUpload';

const steps = ['Choose a Theme', 'Add Personal Details', 'Generate Website Link'];

function Booking() {
  const [activeStep, setActiveStep] = useState(0);
  const [theme, setTheme] = useState('');
  const [personalDetails, setPersonalDetails] = useState({
    company: '',
    about: '',
    email: '',
    contact: '',
  });
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState(null);
  const [userId, setUserId] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const userIdFromSessionStorage = localStorage.getItem('userId');
    if (userIdFromSessionStorage) {
      setUserId(userIdFromSessionStorage);
    }
  }, []);

  const link = `http://localhost:3000/booking-appointment/${userId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    } catch (error) {
      console.error('Error copying', error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //const

  const ColorVariation = [
    {
      id: 1,
      eColor: '#1a97f5',
      value: 'default',
    },
    {
      id: 2,
      eColor: '#00ab55',
      value: 'green',
    },
    {
      id: 3,
      eColor: '#fc4b6c',
      value: 'red',
    },
    {
      id: 4,
      eColor: '#1e4db7',
      value: 'azure',
    },
    {
      id: 5,
      eColor: '#fdd43f',
      value: 'warning',
    },
  ];

  const [color, setColor] = useState('');

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Box sx={{ marginTop: '50px' }}>
              <FormLabel sx={{ mr: '15px' }}> Select a theme for your booking page:</FormLabel>
              {ColorVariation.map((mcolor) => (
                <Fab
                  color="primary"
                  style={{ backgroundColor: mcolor.eColor, marginRight: '10px' }}
                  size="small"
                  key={mcolor.id}
                  //  onClick={() => selectinputChangeHandler(mcolor.value)}
                >
                  {mcolor.value === color ? <FeatherIcon icon="check" size="16" /> : ''}
                </Fab>
              ))}
              <Box>
                {' '}
                <FormLabel
                  htmlFor="title"
                  sx={{
                    marginTop: '50px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '5px',
                  }}
                >
                  Workspace Icon
                  <Typography fontSize="inherit" color="gray">
                    (optional)
                  </Typography>
                </FormLabel>
                <ImageUploader
                  onFileAdded={(img) => setImg(img)}
                  style={{
                    height: 100,
                    width: 200,
                    padding: '10px',
                    background: 'none',
                    border: 'dotted 1px',
                    color: 'black',
                  }}
                  uploadIcon={<FileUploadIcon />}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '14px',
                    mt: '30px',
                  }}
                  color="gray"
                >
                  Upload an image or icon to personalize your workspace.
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography>Enter your personal details:</Typography>
            <TextField
              label="Company"
              variant="outlined"
              fullWidth
              value={personalDetails.company}
              onChange={(e) => setPersonalDetails({ ...personalDetails, company: e.target.value })}
              margin="normal"
            />
            <TextField
              label="About Us"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={personalDetails.about}
              onChange={(e) => setPersonalDetails({ ...personalDetails, about: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={personalDetails.email}
              onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Contact Info"
              variant="outlined"
              fullWidth
              value={personalDetails.contact}
              onChange={(e) => setPersonalDetails({ ...personalDetails, contact: e.target.value })}
              margin="normal"
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography>Generate your booking website link:</Typography>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Generate Link
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Typography variant="h3">Create your own Booking website</Typography>
        <Typography fontSize={12} mb={3} color="GrayText">
          {' '}
          Just with one click the customers can reach your business profiles and book appointments.
        </Typography>
      </Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <Box>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you're finished</Typography>
          <Button onClick={handleReset}>Reset</Button>
        </Box>
      ) : (
        <Box>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit}>Finish</Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </Box>
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 0, top: 0 }}>
          <CloseIcon />
        </IconButton>
        <DialogTitle id="alert-dialog-title">Direct Link for bookings</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography fontSize={12} mb={3} color="GrayText">
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
            </Typography>
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
        <DialogActions />
      </Dialog>
    </Box>
  );
}

export default Booking;
