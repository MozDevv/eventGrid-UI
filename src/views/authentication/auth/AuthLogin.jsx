import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  TextField,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import endpoints, { apiService } from 'src/services/api';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
const AuthLogin = ({ title, subtitle, subtext }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setIsLoading(true);

    e.preventDefault();
    const user = { email, password };

    try {
      const res = await apiService.post(endpoints.login, user);
      if (res.status === 200) {
        const id = res.data.id;
        const token = res.data.token;

        localStorage.setItem('userId', id);
        console.log(id);
        console.log(res.data);

        localStorage.setItem('token', token);

        if (res.data.refresh_token && res.data.refresh_token) {
          localStorage.setItem('refresh_token', res.data.refresh_token);
        }
        console.log('refresh', res.data.refresh_token);

        navigate('/dashboard');
      }
    } catch (error) {
      setError(true);
      console.log('Error loggging in', error.response);
      console.log(user);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          eventGrid
        </Typography>
      ) : null}

      <Stack>
        {error && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',

              alignItems: 'center',
            }}
          >
            {' '}
            <Typography color="crimson">Unauthorised, Please try again.</Typography>
            <IconButton sx={{ marginLeft: '-7px' }} onClick={() => setError(false)}>
              <CloseIcon fontSize="small" color="crimson" />
            </IconButton>
          </Box>
        )}
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="5px"
          >
            Email
          </Typography>
          <TextField
            id="username"
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            error={error}
          />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            variant="outlined"
            required={true}
            error={error}
            helperText={'Password is required'}
            fullWidth
          />
        </Box>
        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Remember this Device" />
          </FormGroup>
          <Typography
            component={Link}
            to="/"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={isLoading}
          type="submit"
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
