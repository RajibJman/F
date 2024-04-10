import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Route, Routes } from 'react-router-dom';
import RegistrationPage from '../../component/registration';
import AddUserModule from '../../component/AddUserModule';
import AddQuizForm from '../Admin/addquiz';
import Navbar from '../../component/Navbar';
import Button from '@mui/material/Button';

const localizer = momentLocalizer(moment);

const UserDashboard = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/getevent');
      if (response.ok) {
        const eventData = await response.json();
        const formattedEvents = eventData.map(event => ({
          id: event._id,
          title: `${event.details} - ${event.time}`,
          start: moment(event.date).toDate(),
          end: moment(event.date).toDate(),
          details: event.details,
          time: event.time,
        }));
        setEvents(formattedEvents);
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ width: '30%',marginTop: '35px'  }}>
          <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>Menu</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#2196f3', fontSize: '1.2rem', width: '100%', marginBottom: '10px' }}
                href="/profile"
              >
                Profile
              </Button>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#4caf50', fontSize: '1.2rem', width: '100%', marginBottom: '10px' }}
                href="/modulestatus"
              >
               Training Module
              </Button>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#ff9800', fontSize: '1.2rem', width: '100%', marginBottom: '10px' }}
                href="/assesment"
              >
                Give Assessment
              </Button>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#2196f3', fontSize: '1.2rem', width: '100%', marginBottom: '10px' }}
                href="/userresult"
              >
                Results
              </Button>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#4caf50', fontSize: '1.2rem', width: '100%', marginBottom: '10px' }}
                href="/passReset"
              >
                Password Reset
              </Button>
            </li>
          </ul>
        </div>
        <div style={{ width: '60%' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: '50px' }}
          />
        </div>
      </div>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/module" element={<AddUserModule />} />
        <Route path="/quiz" element={<AddQuizForm />} />
      </Routes>
    </div>
  );
};

export default UserDashboard;
