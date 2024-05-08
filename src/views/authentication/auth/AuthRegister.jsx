import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import endpoints, { apiService } from 'src/services/api';

const AuthRegister = ({ title, subtitle, subtext }) => {
  const [firstName, setfirstName] = useState('');
  const [lastname, setlastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [error, setError] = useState({ status: false, message: '' });

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const user = {
      firstName,
      lastname,
      phoneNumber,
      email,
      password,
      company,
    };

    try {
      const res = await apiService.post(endpoints.register, user);
      if (res.status === 200) {
        const id = res.data.id;

        console.log(user);

        console.log('user', user);

        window.location.href = '/dashboard';
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', id);

        setUserId(id);

        console.log('token', res.data.token);

        const token = res.data.token;
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.log('The error is error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Box>
        <Stack mb={3}>
          {error.status && (
            <Typography color="crimson">Registration failed! Please try again.</Typography>
          )}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="name"
            mb="5px"
          >
            {' '}
            First Name
          </Typography>
          <TextField
            id="fname"
            onChange={(e) => setfirstName(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="name"
            mb="5px"
          >
            Last Name
          </Typography>

          <TextField
            id="lname"
            onChange={(e) => setlastName(e.target.value)}
            variant="outlined"
            fullWidth
          />

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="name"
            mb="5px"
          >
            Company
          </Typography>
          <TextField
            id="company"
            onChange={(e) => setCompany(e.target.value)}
            variant="outlined"
            fullWidth
          />

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
            mt="25px"
          >
            Email Address
          </Typography>
          <TextField
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
          />

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
            mt="25px"
          >
            Password
          </Typography>
          <TextField
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Stack>
        <Button
          disabled={isLoading}
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;