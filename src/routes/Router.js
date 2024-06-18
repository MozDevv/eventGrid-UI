import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ACalendar from 'src/views/calendar/ACalendar';
import OauthCallback from 'src/views/calendar/OauthCallback';
import CalendlyCallback from 'src/views/calendar/CalendlyCallback';
import Clients2 from 'src/views/clients2/Clients2';
import Booking from 'src/views/booking/Booking';
import BookAppointment from 'src/views/book-appointment/BookAppointment';

const EnhancedTable = Loadable(lazy(() => import('../views/clients/EnhancedTable')));

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')));
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Icons = Loadable(lazy(() => import('../views/icons/Icons')));
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')));
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/ui/typography', exact: true, element: <TypographyPage /> },
      { path: '/calendar', exact: true, element: <ACalendar /> },
      { path: '/clients', exact: true, element: <Clients2 /> },
      { path: '/online-booking', exact: true, element: <Booking /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: 'callback', element: <OauthCallback /> },
      { path: 'calendly-callback', element: <CalendlyCallback /> },
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      { path: 'book-appointment/:userId', element: <BookAppointment /> },
    ],
  },
];

export default Router;
