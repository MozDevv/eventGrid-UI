import React, { useEffect, useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  Typography,
  Breadcrumbs,
  FormLabel,
  Drawer,
  Box,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Events from './EventData';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import PageContainer from 'src/components/container/PageContainer';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import endpoints, { apiService } from 'src/services/api';
import axios from 'axios';
import TopOnlyDrawer from './TopOnlyDrawer';
import OpenEventModal from './OpenEventModal';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router';
import calenderImg from './../../assets/images/img/google-calendar.png';
import calendlyImg from './../../assets/images/img/Calendly-New-Logo.png';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const ACalendar = () => {
  const [calevents, setCalEvents] = useState(Events);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = useState('');
  const [slot, setSlot] = useState();
  const [color, setColor] = useState('default');
  const [update, setUpdate] = useState();

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
  const addNewEventAlert = (slotInfo) => {
    setOpen(true);
    setSlot(slotInfo);
  };
  const selectinputChangeHandler = (id) => setColor(id);

  const deleteHandler = (event) => {
    const updatecalEvents = calevents.filter((ind) => ind.title !== event.title);
    setCalEvents(updatecalEvents);
  };
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setName('');
    setUpdate(null);
  };

  const eventColors = (event) => {
    let style = {};
    if (event.color) {
      style = { className: `event-${event.color}` };
    } else {
      style = { className: `event-default` };
    }

    style.style = {
      // Adjust the height as needed
      display: 'flex',
      alignItems: 'center', // Align text vertically center
      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
    };

    return style;
  };

  //my logic /*************** */

  const [loading, setIsLoading] = useState(true);

  const [allEvents, setAllEvents] = useState([]);

  //const

  const fetchAllEvents = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const res = await apiService.get(endpoints.fetchAllEvents(userId));

      console.log(res.data);

      return res.data;
    } catch (error) {
      console.log('eror fethcing', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents().then((res) => setAllEvents(res));
  }, []);

  const [newEvent, setNewEvent] = useState({
    title: '',
    desc: '',
    start: new Date().toISOString().slice(0, 16), // Default value for start datetime-local input
    end: new Date().toISOString().slice(0, 16), // Default value for end datetime-local input
  });

  const [name, setName] = useState('');

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const storedAccessToken = localStorage.getItem('acess_token');

    const eventData = {
      title: name,
      description: newEvent.desc,
      color: color,
      start: slot.start,
      end: slot.end,
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

      setNewEvent({
        title: '',
        description: '',
        start: new Date().toISOString().slice(0, 16),
        end: new Date().toISOString().slice(0, 16),
      });

      console.log('eventData', eventData);

      setOpen(false);
    } catch (error) {
      console.log('Error saving event', error);
      console.log('Error saving event', eventData, userId, token);
    }
  };

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refresh_token');

    const payload = {
      client_id: '542930331564-632fo1ruiikkj37i1296dusmn68r31gc.apps.googleusercontent.com',
      client_secret: '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',
      grant_type: 'refresh_token',
      refresh_token:
        '1//091fI8qOoKT5KCgYIARAAGAkSNwF-L9IrEDkKi1kxTMJBdjaigJNZbRwICHonGuTMFaKjhOVlEjeJiVGyWuZZRoZDrH2EHBxJfTA',
    };

    try {
      const res = await axios.post('https://oauth2.googleapis.com/token', payload);

      setAccessToken(res.data.access_token);

      localStorage.setItem('acess_token', res.data.access_token);

      console.log('refreshed data', res.data);
    } catch (error) {
      console.log(error.response);
      console.log('payload', payload);
    }
  };

  /* useEffect(() => {
    refreshAccessToken();
    const intervalId = setInterval(refreshAccessToken, 55 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [accessToken]);
*/
  //

  const createEventGoogleCalender = async (accessToken) => {
    const formattedStart = new Date(slot.start).toISOString();
    const formattedEnd = new Date(slot.end).toISOString();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      summary: name,

      start: {
        dateTime: formattedStart,
        timeZone: timeZone,
      },

      end: {
        dateTime: formattedEnd,
        timeZone: timeZone,
      },
    };

    try {
      const res = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?key=AIzaSyBKrtUDC9I1o7r-esq-GXXbaB-oqsMlR6M',
        payload,
        {
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

  const events = allEvents.map(({ start, end, ...rest }) => ({
    start: new Date(Date.parse(start)),
    end: new Date(Date.parse(end)),
    ...rest,
  }));

  const [openAddEvent, setOpenAddEvent] = useState(false);

  const handleOpenDrawer = () => {
    setOpenAddEvent(true);
  };

  const handleDrawerClose = () => {
    setOpenAddEvent(false);
  };

  const [openModal, setOpenModal] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [selectedId, setSelectedId] = useState(null);

  const handleSelectEvent = (event) => {
    setSelectedId(event.id);
    console.log('selectedEvent', event);
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const navigate = useNavigate();

  const handleRedirectUri = () => {
    window.location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      'scope=https://www.googleapis.com/auth/calendar+https://www.googleapis.com/auth/calendar.events&' +
      'access_type=offline&' +
      'include_granted_scopes=true&' +
      'response_type=code&' +
      'state=hellothere&' +
      'redirect_uri=http://localhost:3000/auth/callback&' +
      'client_id=542930331564-632fo1ruiikkj37i1296dusmn68r31gc.apps.googleusercontent.com';
  };
  const handleCalendlyRedirect = () => {
    window.location.href =
      'https://auth.calendly.com/oauth/authorize?' +
      'client_id=XvDahvEdtfHJ8AnLqjlf1WZ_pNTNz68ajGFdeKQUvNY&' +
      'response_type=code&' +
      'redirect_uri=http://localhost:3000/auth/calendly-callback';
  };

  ////********** */

  const handleGetCalendrEvents = () => {};
  return (
    <PageContainer title="Calendar ui" description="this is Calendar page">
      {selectedEvent && (
        <OpenEventModal
          selectedId={selectedId}
          ColorVariation={ColorVariation}
          selectinputChangeHandler={selectinputChangeHandler}
          openModal={openModal}
          setOpenModal={setOpenModal}
          setAllEvents={setAllEvents}
          selectedEvent={selectedEvent}
        />
      )}
      {openAddEvent && (
        <>
          <Drawer
            TransitionComponent={Slide}
            SlideProps={{
              direction: 'down', // Slide direction
              timeout: 500, // Transition duration
            }}
            onClose={handleDrawerClose}
            anchor="top"
            open={openAddEvent}
          >
            <TopOnlyDrawer
              fetchAllEvents={fetchAllEvents}
              setAllEvents={setAllEvents}
              openAddEvent={openAddEvent}
              setOpenAddEvent={setOpenAddEvent}
              ColorVariation={ColorVariation}
            />
          </Drawer>
        </>
      )}

      <Breadcrumbs title="Calendar" subtitle="App" />

      <Card>
        <Box sx={{ display: 'flex', mb: '10px', justifyContent: 'space-between' }}>
          <Button onClick={handleOpenDrawer} variant="contained" sx={{ ml: '20px' }}>
            New Event
          </Button>
          <Box sx={{ display: 'flex', gap: '20px' }}>
            {' '}
            <Button
              onClick={handleCalendlyRedirect}
              variant="contained"
              sx={{
                display: 'flex',
                alignItems: 'center',

                padding: '10px 35px',
                textAlign: 'center',
                transition: '0.5s',
                position: 'relative',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                borderRadius: '10px',
              }}
              color="text"
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {' '}
                <img src={calendlyImg} height={28} width={50} alt="" />
                Calendly
              </Box>
              <Typography
                sx={{
                  fontSize: '9px',
                  borderRadius: '10px',

                  padding: '0 4px',
                  position: 'absolute',
                  top: 0,
                  color: '#00C631',

                  right: '1px',
                }}
              >
                <FeatherIcon icon="link" size={20} />
              </Typography>
            </Button>
            <Button
              onClick={handleRedirectUri}
              variant="contained"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '10px 35px',
                textAlign: 'center',
                transition: '0.5s',
                position: 'relative',
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                borderRadius: '10px',
              }}
              color="text"
            >
              <img src={calenderImg} height={28} width={28} alt="" />
              Google Calender
              <Typography
                sx={{
                  fontSize: '9px',
                  borderRadius: '10px',

                  padding: '0 4px',
                  position: 'absolute',
                  top: 0,
                  color: '#00C631',

                  right: '1px',
                }}
              >
                <FeatherIcon icon="link" size={20} />
              </Typography>
            </Button>
          </Box>
        </Box>

        <CardContent>
          <Calendar
            selectable
            setAllEvents={setAllEvents}
            fetchAllEvents={fetchAllEvents}
            events={events}
            defaultView="month"
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: 'calc(100vh - 350px' }}
            onSelectEvent={(event) => handleSelectEvent(event)}
            onSelectSlot={(slotInfo) => {
              addNewEventAlert(slotInfo);
              console.log('slot>>>>>>>>', slotInfo);
            }}
            eventPropGetter={(event) => eventColors(event)}
          />
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <form
          onSubmit={handleAddEvent}
          //</Dialog>onSubmit={update ? updateEvent : submitHandler}
        >
          <DialogContent>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {update ? 'Update Event' : 'Add Event'}
            </Typography>
            <FormLabel htmlFor="Event Title">Event Title</FormLabel>
            <CustomTextField
              id="Event Title"
              placeholder="Enter Event Title"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => setName(e.target.value)}
              size="small"
            />
            <FormLabel>Select Event Color</FormLabel>

            {ColorVariation.map((mcolor) => {
              return (
                <Fab
                  color="primary"
                  style={{ backgroundColor: mcolor.eColor }}
                  sx={{ marginRight: '3px' }}
                  size="small"
                  key={mcolor.id}
                  onClick={() => selectinputChangeHandler(mcolor.value)}
                >
                  {mcolor.value === color ? <FeatherIcon icon="check" size="16" /> : ''}
                </Fab>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>

            {update ? (
              <Button
                type="submit"
                color="error"
                variant="contained"
                onClick={() => deleteHandler(update)}
              >
                Delete
              </Button>
            ) : (
              ''
            )}
            <Button type="submit" disabled={!name} variant="contained">
              {update ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default ACalendar;
