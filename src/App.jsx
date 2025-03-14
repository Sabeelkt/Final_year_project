import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Home';
import OrganizerDashboard from './pages/organizer/Dashboard';
import AdminDashboard from './pages/admin/Dashboard/Dashboard';
import EventDetails from './pages/EventDetails';
import AuthProvider  from './context/AuthContext';
import Registeration from './pages/student/Register'
import PreviousEvent from './pages/student/PreviousEvent'
import CreateEvent from './pages/organizer/CreateEvent';
import EventDetail from './pages/organizer/EventDetail';
import EventReport from './pages/organizer/EventReport';
import EventRequest from './pages/organizer/EventRequest';
import AccRegister from './pages/AccRegister';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path='/AccRegister' element={<AccRegister />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/student/register" element={<Registeration />} />
          <Route path="/student/previous-event" element={<PreviousEvent />} />
          <Route path="/organizer/*" element={<OrganizerDashboard />} />
          <Route path="/organizer/create-event" element={<CreateEvent />} />
          <Route path="/organizer/events/*" element={<EventDetail />} />
          <Route path="/organizer/event/report" element={<EventReport />} />
          <Route path="/orgaziner/eventrequest" element={<EventRequest />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;