import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Fab,
  FormLabel,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import React, { useState } from 'react';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ScrollBar from 'react-perfect-scrollbar';
import endpoints, { apiService } from 'src/services/api';
import axios from 'axios';
import calendlyImg from './../../assets/images/img/Calendly-New-Logo.png';

import meet from '../../assets/images/img/meet.png';
import Spinner from '../spinner/Spinner';

const TopOnlyDrawer = ({
  ColorVariation,
  fetchAllEvents,
  setAllEvents,
  openAddEvent,
  setOpenAddEvent,
}) => {
  const [color, setColor] = useState('default');
  const [selectedDate, setSelectedDate] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleDateChange = (newDate) => {
    console.log('date', newDate);
    setSelectedDate(newDate);
  };

  const selectinputChangeHandler = (id) => setColor(id);

  const toggleExpanded = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const [editorHtml, setEditorHtml] = useState('');

  const handleChange = (html) => {
    setEditorHtml(html);
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const [title, setTitle] = useState('');

  const [loading, setIsLoading] = useState(false);

  const [error, setErrors] = useState({ status: true, message: '' });

  const handleSaveEvent = async () => {
    console.log('*******', selectedDate.$d);

    const storedAccessToken = localStorage.getItem('acess_token');

    setIsLoading(true);

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (selectedDate === null) {
      setErrors({
        status: false,
        message: 'Please select a date for the event',
      });

      return;
    }

    const eventData = {
      title: title,
      //description: newEvent.desc,
      color: color,
      start: selectedDate.$d,
      end: selectedDate.$d,
    };

    try {
      const res = await apiService.post(endpoints.addNewEvent(userId), eventData);

      console.log('The event is', res.data);

      createEventGoogleCalender(storedAccessToken);

      await fetchAllEvents()
        .then((res) => setAllEvents(res))
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log('Error saving event', error);
      console.log('Error saving event', eventData, userId, token);
    } finally {
      setColor('default');
      setSelectedDate(null);
      setTitle('');
      setIsLoading(false);
      setOpenAddEvent(false);
    }
  };

  const [addGoogleMeet, setAddGoogleMeet] = useState(false);

  function generateUniqueId() {
    const timestamp = new Date().getTime();

    const randomString = Math.random().toString(36).substring(2);

    const uniqueId = `${timestamp}-${randomString}`;

    return uniqueId;
  }

  const saveEventonDbandCalendar = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');
    const formattedStart = new Date(selectedDate.$d).toISOString();
    const formattedEnd = new Date(selectedDate.$d).toISOString();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      summary: title,
      start: formattedStart,
      end: formattedEnd,
      timezone: timeZone,
      isAddGoogleMeet: addGoogleMeet,
    };

    try {
      const res = await apiService.post(endpoints.saveEventsOnGoogleCalendar(userId), payload);

      if (res.status === 200) {
        console.log('data', res.data);
        await fetchAllEvents()
          .then((res) => setAllEvents(res))
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
      console.log(payload);
    } finally {
      setColor('default');
      setSelectedDate(null);
      setTitle('');
      setIsLoading(false);
      setOpenAddEvent(false);
    }
  };

  const createEventGoogleCalender = async (accessToken) => {
    const formattedStart = new Date(selectedDate.$d).toISOString();
    const formattedEnd = new Date(selectedDate.$d).toISOString();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      summary: title,

      start: {
        dateTime: formattedStart,
        timeZone: timeZone,
      },

      end: {
        dateTime: formattedEnd,
        timeZone: timeZone,
      },
      sendUpdates: 'all',
      ...(addGoogleMeet
        ? {
            conferenceData: {
              createRequest: {
                requestId: generateUniqueId(),
                conferenceSolutionKey: {
                  type: 'hangoutsMeet',
                },
              },
            },
          }
        : {}),
    };

    try {
      const res = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?key=AIzaSyBKrtUDC9I1o7r-esq-GXXbaB-oqsMlR6M',
        payload,

        {
          params: {
            conferenceDataVersion: 1, // Ensure this is included
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(res.data);

      console.log('payload', payload);
    } catch (error) {
      console.log(error.response);
      console.log('access token', accessToken);
      console.log('payload', payload);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <Box sx={{ p: '20px' }}>
          <Box>
            <Typography variant="h3" mb="10px">
              New Event
            </Typography>
          </Box>
          <Divider />
          <ScrollBar style={{ maxHeight: '530px' }}>
            {error.status && (
              <Typography variant="subtitle2" color="crimson">
                {error.message}
              </Typography>
            )}
            <Box
              sx={{
                p: '20px',
                mt: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', gap: '50px' }}>
                <FormLabel sx={{ width: '100px', mt: 1, display: 'flex', gap: '3px' }}>
                  Event Title <Typography color="red">*</Typography>
                </FormLabel>
                <TextField
                  id="Event Title2"
                  required={true}
                  placeholder="Enter Event Title *"
                  variant="outlined"
                  fullWidth
                  sx={{ width: '90%' }}
                  size="small"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel sx={{ mr: '15px' }}>Select Event Color</FormLabel>
                {ColorVariation.map((mcolor) => (
                  <Fab
                    color="primary"
                    style={{ backgroundColor: mcolor.eColor, marginRight: '10px' }}
                    size="small"
                    key={mcolor.id}
                    onClick={() => selectinputChangeHandler(mcolor.value)}
                  >
                    {mcolor.value === color ? <FeatherIcon icon="check" size="16" /> : ''}
                  </Fab>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: '105px', alignItems: 'center' }}>
                <FormLabel htmlFor="Event Title" sx={{ display: 'flex', gap: '3px' }}>
                  Date <Typography color="crimson">*</Typography>
                </FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} required={true} />}
                    label="Select Date and Time"
                    value={selectedDate}
                    onChange={handleDateChange}
                    fullWidth
                    inputFormat="dd/MM/yyyy hh:mm a"
                    sx={{ mt: 3 }}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            <Box
              sx={{
                ml: '10px',
              }}
            >
              <Button onClick={toggleExpanded}>
                {expanded ? (
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    Show Less <ArrowDropUpIcon />
                  </Typography>
                ) : (
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    Show More <ArrowDropDownIcon />
                  </Typography>
                )}
              </Button>
              <Collapse
                sx={{ display: 'flex', flexDirection: 'column', gap: '50px' }}
                in={expanded}
                collapsedSize={200}
                unmountOnExit
              >
                <Box p={2} sx={{ display: 'flex', gap: '30px' }}>
                  <Button
                    sx={{
                      maxHeight: '50px',
                      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                      borderRadius: '10px',
                    }}
                    variant={addGoogleMeet ? 'contained' : 'text'}
                    color="warning"
                  >
                    <Checkbox
                      checked={addGoogleMeet}
                      onChange={(event) => {
                        setAddGoogleMeet(!addGoogleMeet);
                      }}
                    />
                    <img src={meet} height={24} width={24} alt="" />
                    <Typography ml={1} color="primary">
                      Add Google Meet Video Conferencing
                    </Typography>
                  </Button>
                  <Button
                    sx={{
                      maxHeight: '50px',
                      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                      borderRadius: '10px',
                    }}
                    variant="text"
                  >
                    <Checkbox />
                    <img
                      src={calendlyImg}
                      style={{ marginLeft: '-10px' }}
                      height={24}
                      width={40}
                      alt=""
                    />
                    <Typography>Save event on Calendly</Typography>
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: '50px', mt: 3 }}>
                  <FormLabel htmlFor="Event Title">Description</FormLabel>
                  <ReactQuill
                    theme="snow"
                    style={{ width: '70%' }}
                    value={editorHtml}
                    onChange={handleChange}
                  />
                </Box>

                <Box sx={{ mt: '100px', display: 'flex', gap: '60px', pb: '20px' }}>
                  <FormLabel htmlFor="Event Title">Duration</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="Start Date and Time"
                      value={startDate}
                      onChange={handleStartDateChange}
                      fullWidth
                      inputFormat="dd/MM/yyyy hh:mm a"
                      sx={{ mb: 3 }}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="End Date and Time"
                      value={endDate}
                      onChange={handleEndDateChange}
                      fullWidth
                      inputFormat="dd/MM/yyyy hh:mm a"
                      sx={{ mb: 3 }}
                    />
                  </LocalizationProvider>
                  <Button
                    variant="outlined"
                    sx={{ maxHeight: '35px', mt: '15px' }}
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </Box>
              </Collapse>
            </Box>
          </ScrollBar>
          <Box>
            <Divider sx={{ mb: 1 }} />
            <Box
              sx={{ width: '100%', display: 'flex', gap: '10px', justifyContent: 'space-between' }}
            >
              <Button variant="outlined" color="warning" onClick={() => setOpenAddEvent(false)}>
                Cancel
              </Button>{' '}
              <Button
                variant="contained"
                disabled={title === '' || !selectedDate}
                onClick={saveEventonDbandCalendar}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default TopOnlyDrawer;
