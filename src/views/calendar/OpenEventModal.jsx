import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Divider,
  Fab,
  FormLabel,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import FeatherIcon from 'feather-icons-react';
import endpoints, { apiService } from 'src/services/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import meet from '../../assets/images/img/meet.png';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const OpenEventModal = ({
  openModal,
  selectedEvent,
  setOpenModal,
  ColorVariation,

  setAllEvents,
  selectedId,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString();
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setColor(selectedEvent.color);
    setIsEditing(false);
    setOpenModal(false);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const fetchAllEvents = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const res = await apiService.get(endpoints.fetchAllEvents(userId));

      console.log(res.data);

      setAllEvents(res.data);
    } catch (error) {
      console.log('eror fethcing', error);
      throw error;
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const res = await apiService.delete(endpoints.deleteEvent(selectedId));

      if (res.status === 200) {
        await fetchAllEvents();

        setDeleteOpen(false);
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [title, setTitle] = useState(selectedEvent.title);
  const [color, setColor] = useState(selectedEvent.color);
  const [startDate, setStartDate] = useState(selectedEvent.start);
  const [endDate, setEndDate] = useState(selectedEvent.end);

  useEffect(() => {
    setTitle(selectedEvent.title);
    setColor(selectedEvent.color);
    setStartDate(selectedEvent.start);
    setEndDate(selectedEvent.end);
  }, [selectedEvent]);

  const handleUpdateEvent = async () => {
    const updatedEvent = {
      title: title,
      color: color,
      start: startDate.$d || selectedEvent.start,
      end: endDate.$d || selectedEvent.end,
    };

    try {
      const res = await apiService.put(endpoints.updateEvent(selectedId), updatedEvent);

      if (res.status === 200) {
        setOpenModal(false);
        await fetchAllEvents();
      }
    } catch (error) {
      console.log('error saving', error.response);

      console.log('event body', updatedEvent);
    } finally {
      setIsEditing(false);
    }
  };

  const selectinputChangeHandler = (id) => {
    setIsEditing(true);
    setColor(id);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleOpenEventLink = (link) => {
    window.open(link, '_blank');
  };

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(selectedEvent.meetingUrl)
      .then(() => {
        setCopied(true);
      })
      .catch((error) => {
        console.error('Failed to copy: ', error);
        alert('Failed to copy meeting URL!');
      });
  };

  function formatDateRange(startDate, endDate) {
    // Day names array
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Month names array
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Format start date
    const startDay = days[startDate.getDay()];
    const startMonth = months[startDate.getMonth()];
    const startNum = startDate.getDate();
    const startHours = startDate.getHours();
    const startMinutes = startDate.getMinutes();

    // Format end date
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();

    // Construct the formatted string
    const formattedStartDate = `${startDay}, ${startMonth} ${startNum}⋅${startHours}:${startMinutes
      .toString()
      .padStart(2, '0')}`;
    const formattedEndDate = `${endHours}:${endMinutes.toString().padStart(2, '0')}${
      endHours >= 12 ? 'pm' : 'am'
    }`;

    return `${formattedStartDate} – ${formattedEndDate}`;
  }

  return (
    <div>
      <Dialog
        className={classes.modal}
        open={openModal && selectedEvent}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" color="warning">
                Event Details
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', mb: 1, gap: '10px' }}>
              <Button
                onClick={() => handleOpenEventLink(selectedEvent.eventLink)}
                variant="text"
                sx={{ display: 'flex', gap: '2px' }}
              >
                <Typography fontSize="12px">Open Event Link</Typography>
                <LaunchIcon fontSize="14px" />
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {isEditing ? (
            <>
              <Box>
                <FormLabel htmlFor="Event Title">Event Title</FormLabel>
                <TextField
                  id="Event Title"
                  variant="outlined"
                  fullWidth
                  value={!isEditing ? selectedEvent.title : title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 2 }}
                  size="small"
                  InputProps={{
                    readOnly: !isEditing,
                    endAdornment: isEditing ? null : (
                      <IconButton onClick={handleEditClick}>
                        <EditIcon fontSize="12px" />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ mb: '10px' }}>
                <FormLabel htmlFor="Event Title">Event Start</FormLabel>
                {isEditing ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          id="Event Titleznan"
                          variant="outlined"
                          fullWidth
                          sx={{ mb: 1 }}
                          size="small"
                        />
                      )}
                      value={startDate}
                      onChange={handleStartDateChange}
                      fullWidth
                      inputFormat="dd/MM/yyyy hh:mm a"
                      sx={{ mb: 3 }}
                    />
                  </LocalizationProvider>
                ) : (
                  <TextField
                    id="Event Titlewnns"
                    variant="outlined"
                    fullWidth
                    value={formatDateTime(selectedEvent.start)}
                    sx={{ mb: 1 }}
                    InputProps={{
                      readOnly: true,
                    }}
                    size="small"
                  />
                )}
              </Box>
              <Box sx={{ mb: '10px' }}>
                <FormLabel htmlFor="Event Title">Event End</FormLabel>
                {isEditing ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          id="Event Title1"
                          variant="outlined"
                          fullWidth
                          sx={{ mb: 1 }}
                          size="small"
                        />
                      )}
                      value={endDate}
                      onChange={handleEndDateChange}
                      fullWidth
                      inputFormat="dd/MM/yyyy hh:mm a"
                      sx={{ mb: 3 }}
                    />
                  </LocalizationProvider>
                ) : (
                  <TextField
                    id="Event Title221"
                    variant="outlined"
                    fullWidth
                    value={formatDateTime(selectedEvent.start)}
                    sx={{ mb: 1 }}
                    InputProps={{
                      readOnly: true,
                    }}
                    size="small"
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <FormLabel htmlFor="Event Title">Change event Color</FormLabel>

                <Box>
                  {' '}
                  {ColorVariation.map((mcolor) => {
                    return (
                      <Fab
                        color="primary"
                        style={{ backgroundColor: mcolor.eColor }}
                        sx={{ marginRight: '12px', mb: 2 }}
                        size="small"
                        key={mcolor.id}
                        onClick={() => selectinputChangeHandler(mcolor.value)}
                      >
                        {mcolor.value === color ? <FeatherIcon icon="check" size="16" /> : ''}
                      </Fab>
                    );
                  })}
                </Box>
              </Box>{' '}
            </>
          ) : (
            <>
              <Box
                sx={{
                  backgroundColor: '#F1F3F4',
                  borderRadius: '15px',
                  mb: '10px',
                  display: 'flex',

                  ml: '4px',
                  padding: '2px',
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ pl: '20px' }} mt={2}>
                    {selectedEvent.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: '15px',
                      mb: '10px',
                      pl: '12px',
                    }}
                    variant="subtitle2"
                  >
                    {formatDateRange(selectedEvent.start, selectedEvent.end)}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setIsEditing(true)}
                  sx={{
                    ml: 'auto',
                    backgroundColor: '#d4dbde',
                    borderRadius: '50%',
                    mt: 'auto',
                    mb: 'auto',
                    mr: '10px',
                    height: '35px',
                  }}
                >
                  <EditIcon
                    sx={{
                      fontSize: '17px',
                    }}
                  />
                </IconButton>
              </Box>
            </>
          )}

          {selectedEvent.meetingUrl !== null && (
            <Box>
              <Box sx={{ display: 'flex', mt: 3, gap: '10px', pb: '12px' }}>
                <img src={meet} height={24} style={{ marginTop: '5px' }} width={24} alt="" />
                <Button
                  variant="contained"
                  onClick={() => handleOpenEventLink(selectedEvent.meetingUrl)}
                  sx={{ display: 'flex', gap: '10px', maxHeight: '28px' }}
                >
                  <Typography fontSize={11}>Join with Google Meet </Typography>
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="text"
                  sx={{ display: 'flex', gap: '1px' }}
                >
                  {copied ? (
                    <LibraryAddCheckOutlinedIcon
                      fontSize="small"
                      color="gray"
                      sx={{ fontSize: '15px', color: 'gray' }}
                    />
                  ) : (
                    <ContentCopyIcon
                      fontSize="small"
                      color="gray"
                      sx={{ fontSize: '15px', color: 'gray' }}
                    />
                  )}

                  <Typography sx={{ color: 'gray', fontStyle: 'italic', fontSize: '11px' }}>
                    {copied ? 'Copied' : 'Copy'} meeting url
                  </Typography>
                </Button>
              </Box>
            </Box>
          )}

          <Divider />
          <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
            <Button
              onClick={isEditing ? handleUpdateEvent : handleDeleteOpen}
              variant="contained"
              sx={{
                backgroundColor: isEditing ? 'blue' : 'crimson',
                fontSize: '12px',
                maxHeight: '25px',
              }}
              color="primary"
              size="small"
            >
              {isEditing ? 'Update Event' : 'Delete Event'}
            </Button>
            <Button
              sx={{ fontSize: '12px', maxHeight: '25px' }}
              onClick={handleClose}
              variant="outlined"
              color="primary"
              size="small"
            >
              Close Modal
            </Button>
          </Box>
        </div>
      </Dialog>
      <Modal
        className={classes.modal}
        open={deleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div className={classes.paper}>
          <Typography variant="h5" mb={1} id="delete-modal-title">
            Delete Confirmation
          </Typography>

          <Typography variant="body1" mb={2} id="delete-modal-description">
            Are you sure you want to delete this event?
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleDeleteEvent}
              variant="contained"
              sx={{ backgroundColor: 'crimson' }}
            >
              Delete
            </Button>
            <Button onClick={handleDeleteClose} variant="outlined">
              Cancel
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default OpenEventModal;
