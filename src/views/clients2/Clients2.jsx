'use client';

import { DataGrid } from '@mui/x-data-grid';

import React, { useEffect, useState } from 'react';
import styles from './clients.module.css';
import ExportToExcel from './../../components/exportToExcel/ExportToExcel';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import Spinner from '../spinner/Spinner';
import EnhancedTable from '../clients/EnhancedTable';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  TextField,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Fade from '@mui/material/Fade';
import endpoints, { apiService } from 'src/services/api';

function Clients2() {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleDateChange = (newDate) => {
    console.log('date', newDate);
    setSelectedDate(newDate);
  };

  const columns = [
    { field: 'clientId', headerName: 'Id', width: 50 },
    { field: 'clientName', headerName: 'Name', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 200 },
    { field: 'email', headerName: 'Email', width: 280 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <DeleteIcon onClick={() => handleDelete(params.row.clientId)} className={styles.delete} />
        </>
      ),
    },
  ];

  const [showForm, setShowForm] = useState(false);

  const [allClients, setAllClients] = useState([]);

  const [newClient, setNewClient] = useState({
    clientId: '',
    clientName: '',
    phoneNumber: '',
    email: '',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');

  const fetchAllClients = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');
    //const token = localStorage.getItem('token');

    try {
      const res = await apiService.get(endpoints.fetchUserClients(userId));

      console.log(res.data);

      return res.data;
    } catch (error) {
      console.log('Error fetching clients', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClients()
      .then((res) => setAllClients(res))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const addClient = async (clientData) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const res = await apiService.post(
        endpoints.createClient(userId),

        clientData,
      );

      console.log(res.data);
    } catch (error) {
      console.log('error adding client', error);
    } finally {
      setAppointmentDate('');
      setName('');
      setEmail('');
      setOpenAddClient(false);
      setOpenSnackBar(true);
    }
  };

  const handleSubmit = async () => {
    const clientData = {
      clientName: name,
      phoneNumber: phoneNumber,
      email: email,
      appointmentDate: selectedDate.$d,
      link: 'ssl.secure.random.implementation = null',
    };

    try {
      await addClient(clientData);

      await fetchAllClients()
        .then((res) => setAllClients(res))
        .catch((err) => {
          console.log(err);
        });

      setOpenAddClient(false);
    } catch (error) {
      console.log('error adding', error);
    }
  };

  const handleDelete = async (clientId) => {
    const token = localStorage.getItem('token');

    try {
      const res = await axios.delete(
        `http://localhost:8088/api/v1/clients/${clientId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        await fetchAllClients()
          .then((res) => setAllClients(res))
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('Error deleting the client', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddBtn = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };

  useEffect(() => {
    fetchAllClients()
      .then((res) => setAllClients(res))
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const [openAddClient, setOpenAddClient] = useState(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };
  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Dialog
            open={openAddClient}
            onClose={() => setOpenAddClient(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Add a new client</DialogTitle>
            <DialogContent>
              <Box>
                <form
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '5px',
                    width: '400px',
                  }}
                >
                  <FormControl
                    fullWidth
                    sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                  >
                    <FormLabel
                      sx={{
                        mt: 0,
                        fontSize: '13px',
                      }}
                      htmlFor="username2-text"
                    >
                      Name
                    </FormLabel>
                    <OutlinedInput
                      endAdornment={
                        <InputAdornment position="end">
                          <FeatherIcon icon="user" width="20" />
                        </InputAdornment>
                      }
                      id="username2-text"
                      placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </FormControl>
                  {/* 2 */}
                  <FormControl
                    fullWidth
                    sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                  >
                    <FormLabel htmlFor="mail2-text" sx={{ fontSize: '13px' }}>
                      Email
                    </FormLabel>
                    <OutlinedInput
                      endAdornment={
                        <InputAdornment position="end">
                          <FeatherIcon icon="mail" width="20" />
                        </InputAdornment>
                      }
                      id="mail2-text"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      fullWidth
                      size="small"
                    />
                  </FormControl>
                  {/* 3 */}
                  <FormControl
                    fullWidth
                    sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                  >
                    <FormLabel sx={{ fontSize: '13px' }} htmlFor="pwd2-text">
                      Phone Number
                    </FormLabel>
                    <OutlinedInput
                      type="text"
                      endAdornment={
                        <InputAdornment position="end">
                          <FeatherIcon icon="phone" width="20" />
                        </InputAdornment>
                      }
                      id="pwd2-text"
                      placeholder="Phone Number"
                      fullWidth
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      size="small"
                    />
                  </FormControl>

                  <FormControl
                    fullWidth
                    sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                  >
                    <FormLabel sx={{ fontSize: '13px' }} htmlFor="cpwd2-text">
                      Appointment Date
                    </FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        renderInput={(props) => <TextField {...props} required={true} />}
                        value={selectedDate}
                        onChange={handleDateChange}
                        fullWidth
                        inputFormat="dd/MM/YYYY hh:mm a"
                        sx={{ mt: 3 }}
                        minDate={new Date()}
                      />
                    </LocalizationProvider>
                  </FormControl>

                  <Divider />
                  <Box
                    pt={3}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: '-10px',
                    }}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        mr: 1,
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => setOpenAddClient(false)}
                      variant="contained"
                      color="error"
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              </Box>
            </DialogContent>
          </Dialog>
          <Snackbar
            open={openSnackBar}
            onClose={handleCloseSnackbar}
            color="white"
            // TransitionComponent={Fade}
            message="Client created successfully!"
            autoHideDuration={3000} // Adjust duration as needed
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            ContentProps={{
              sx: {
                background: 'white',
                color: 'black',
              },
            }}
          />
          <EnhancedTable allClients={allClients} setOpenAddClient={setOpenAddClient} />
        </>
      )}
    </div>
  );
}

export default Clients2;
