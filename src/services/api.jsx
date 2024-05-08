/* eslint-disable no-useless-catch */
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8082/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const setAuthorizationHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const endpoints = {
  login: '/auth/login',

  register: '/auth/register',

  fetchAllEvents: (userId) => `/events/${userId}`,

  addNewEvent: (userId) => `/new/events/${userId}`,

  deleteEvent: (id) => `/events/${id}`,

  updateEvent: (id) => `/events/${id}`,

  saveOauthCreds: (id) => `/user/google/callback/${id}`,

  fetchUserDetails: (id) => `/user/${id}`,

  getCalendarEvents: (id) => `/calender-events/${id}`,

  saveCalendlyCreds: (id) => `/user/calendly/callback/${id}`,

  saveEventsOnGoogleCalendar: (id) => `/integrations/create-event/${id}`,
};

export const apiService = {
  get: async (endpoint, params) => {
    try {
      setAuthorizationHeader();
      const response = await api.get(endpoint, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      setAuthorizationHeader();
      const response = await api.post(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      setAuthorizationHeader();
      const response = await api.put(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  delete: async (endpoint, data) => {
    try {
      setAuthorizationHeader();
      const response = await api.delete(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default endpoints;
