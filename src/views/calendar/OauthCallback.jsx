import React, { useEffect, useState } from 'react';
import Spinner from '../spinner/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import endpoints, { apiService } from 'src/services/api';

function OauthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const state = urlParams.get('state');
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  const [accessToken, setAccessToken] = useState(null);

  const [refreshToken, setRefreshToken] = useState(null);

  const navigate = useNavigate();

  const [errors, setErrors] = useState(false);

  const handleGetTokens = async () => {
    try {
      const payload = {
        client_id: '542930331564-632fo1ruiikkj37i1296dusmn68r31gc.apps.googleusercontent.com',
        client_secret: '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',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/auth/callback',
      };

      const res = await axios.post('https://oauth2.googleapis.com/token', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        await saveAccessandRefresh(res.data.access_token, res.data.refresh_token);

        localStorage.setItem('acess_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        setAccessToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        navigate('/calendar');
      }
    } catch (error) {
      setErrors(true);
      console.log(error.response.data);
    }
  };

  const saveAccessandRefresh = async (access, refresh) => {
    const id = localStorage.getItem('userId');

    const data = {
      access_token: access,
      refresh_token: refresh,
    };
    try {
      const res = await apiService.post(endpoints.saveOauthCreds(id), data);

      console.log(res.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    handleGetTokens();
  }, []);

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

export default OauthCallback;
