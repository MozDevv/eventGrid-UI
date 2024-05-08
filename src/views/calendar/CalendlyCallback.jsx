import React, { useEffect, useState } from 'react';
import Spinner from '../spinner/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import endpoints, { apiService } from 'src/services/api';

function CalendlyCallback() {
  const urlParams = new URLSearchParams(window.location.search);

  const code = urlParams.get('code');

  const [accessToken, setAccessToken] = useState(null);

  const [refreshToken, setRefreshToken] = useState(null);

  const handleGetTokens = async () => {
    const client_id = 'XvDahvEdtfHJ8AnLqjlf1WZ_pNTNz68ajGFdeKQUvNY';

    const client_secret = 'PWKmsgSYB2-UC0Rqoo95aElS7iHbjE-x6tCe2tywfzA';

    const credentials = btoa(`${client_id}:${client_secret}`);

    // Set up the request headers
    const headers = new Headers();
    headers.append('Authorization', `Basic ${credentials}`);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //payload
    const payload = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/auth/calendly-callback',
    }).toString();
    try {
      const response = await axios.post('https://auth.calendly.com/oauth/token', payload, {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      console.log(response.data);

      const { access_token, refresh_token, organization } = response.data;

      await saveAccessandRefresh(access_token, refresh_token, organization);

      setAccessToken(access_token);
      setRefreshToken(refresh_token);
    } catch (error) {
      console.log('payload', payload);
      console.log('headers', headers);
      console.error('Error getting tokens:', error.response);
    }
  };

  useEffect(() => {
    handleGetTokens();
  }, []);

  const saveAccessandRefresh = async (access, refresh, organization) => {
    const payload = {
      access_token: access,
      refresh_token: refresh,
      organization: organization,
    };

    const id = localStorage.getItem('userId');

    try {
      const res = await apiService.post(endpoints.saveCalendlyCreds(id), payload);

      console.log(res.data);

      if (res.status === 200) {
        navigate('/calendar');
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const navigate = useNavigate();

  const [errors, setErrors] = useState(false);

  const handleClick = () => {
    navigate('/calendar');
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
      {errors ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography textAlign="center">
            Error integrating with Google Calendar, Please try again!
          </Typography>
          <Button variant="contained" size="small" onClick={handleClick} sx={{ mt: 2 }}>
            Return to home
          </Button>
        </Box>
      ) : (
        <Spinner />
      )}
    </Box>
  );
}

export default CalendlyCallback;
